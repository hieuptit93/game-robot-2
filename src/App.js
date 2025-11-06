import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header/Header';
import GameArea from './components/GameArea/GameArea';
import Footer from './components/Footer/Footer';
import StartScreen from './components/Screens/StartScreen';
import InstructionScreen from './components/Screens/InstructionScreen';
import WinScreen from './components/Screens/WinScreen';
import GameOverScreen from './components/Screens/GameOverScreen';
import SurveyModal from './components/SurveyModal';
import { usePronunciationScoring } from './hooks/usePronunciationScoring';
import { useSound } from './hooks/useSound';
import BackgroundMusic from './components/BackgroundMusic/BackgroundMusic';
import { supabase } from './lib/supabaseClient';
import { setDatadogUser } from './datadog';
import './App.css';
import './vietnamese-fonts.css';

const WORDS_LIST = [
    // Animals (Động vật)
    'CAT', 'DOG', 'BIRD', 'FISH', 'LION', 'TIGER', 'BEAR', 'RABBIT', 'HORSE', 'ELEPHANT',

    // Colors (Màu sắc)
    'RED', 'BLUE', 'GREEN', 'YELLOW', 'ORANGE', 'PURPLE', 'PINK', 'BLACK', 'WHITE', 'BROWN',

    // Food (Thức ăn)
    'APPLE', 'BANANA', 'ORANGE', 'CAKE', 'BREAD', 'MILK', 'WATER', 'PIZZA', 'COOKIE', 'ICE CREAM',

    // School & Learning (Học tập)
    'BOOK', 'PEN', 'PAPER', 'SCHOOL', 'TEACHER', 'STUDENT', 'MATH', 'SCIENCE', 'ART', 'MUSIC',

    // Family (Gia đình)
    'MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'FAMILY', 'BABY', 'FRIEND', 'LOVE', 'HAPPY', 'SMILE',

    // Activities (Hoạt động)
    'PLAY', 'RUN', 'JUMP', 'SWIM', 'DANCE', 'SING', 'READ', 'WRITE', 'DRAW', 'SLEEP',

    // Nature (Thiên nhiên)
    'SUN', 'MOON', 'STAR', 'TREE', 'FLOWER', 'GRASS', 'RAIN', 'SNOW', 'WIND', 'CLOUD',

    // Body Parts (Bộ phận cơ thể)
    'HEAD', 'HAND', 'FOOT', 'EYE', 'NOSE', 'MOUTH', 'EAR', 'ARM', 'LEG', 'HAIR',

    // Transportation (Phương tiện)
    'CAR', 'BUS', 'TRAIN', 'PLANE', 'BIKE', 'BOAT', 'TRUCK', 'TAXI', 'ROCKET', 'SHIP',

    // Toys & Games (Đồ chơi)
    'BALL', 'DOLL', 'GAME', 'TOY', 'PUZZLE', 'ROBOT', 'KITE', 'BLOCKS', 'CARDS', 'MAGIC'
];

const TOTAL_QUESTIONS = 10;
const INITIAL_TIME = 120; // 2 minutes

// Function to shuffle array
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function App() {
    const [gameState, setGameState] = useState('start');
    const [score, setScore] = useState(0);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [backgroundOffset, setBackgroundOffset] = useState(0);
    const [showBullet, setShowBullet] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [shuffledWords, setShuffledWords] = useState(() => shuffleArray(WORDS_LIST));

    // URL params and session management
    const [urlParams, setUrlParams] = useState({});
    const [userId, setUserId] = useState(null);
    const [age, setAge] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [gameSessionId, setGameSessionId] = useState(null);
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);

    // Use pronunciation scoring hook
    const {
        isRecording,
        recordingBlob,
        isListening,
        vadError,
        startListening,
        stopListening,
        clearBlob
    } = usePronunciationScoring({
        mode: 'vad',
        autoAnalyze: false,
        vadConfig: {
            silenceThreshold: -30,
            speechThreshold: -18,
            minSpeechDuration: 300,
            maxSilenceDuration: 800,
            maxRecordingTime: 7000
        },
        enableLogging: true
    });

    // Use sound effects hook
    const {
        playLaserSound,
        playExplosionSound,
        playSuccessSound,
        playErrorSound,
        playRecordStartSound,
        playClickSound,
        playGameOverSound,
        playVictorySound
    } = useSound();

    const processedBlobRef = useRef(null);

    // Parse URL params once on mount
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const all = {};
            params.forEach((value, key) => {
                all[key] = value;
            });
            // Extract dedicated fields
            const extractedUserId = all.user_id ?? all.userId ?? null;
            const extractedAgeRaw = all.age ?? null;
            const extractedGameId = all.game_id ?? all.gameId ?? null;

            if (extractedUserId != null) setUserId(extractedUserId);
            if (extractedGameId != null) setGameId(extractedGameId);
            if (extractedAgeRaw != null) {
                const n = Number(extractedAgeRaw);
                setAge(Number.isFinite(n) ? n : extractedAgeRaw);
            }

            // Remove extracted keys from general params
            const { user_id, userId, age: ageKey, game_id, gameId, ...rest } = all;
            setUrlParams(rest);
        } catch (e) {
            // noop
        }
    }, []);

    // Set Datadog user when userId is available
    useEffect(() => {
        if (userId) {
            const additionalInfo = {};
            if (age !== null) additionalInfo.age = age;
            if (gameId !== null) additionalInfo.gameId = gameId;

            setDatadogUser(userId, additionalInfo);
        }
    }, [userId, age, gameId]);

    // Create a game_session row only when game actually starts
    useEffect(() => {
        const createSession = async () => {
            if (gameState !== 'playing') return;
            if (gameSessionId) return; // Already have a session
            if (!userId) return; // Need userId to create session

            const numericAge = Number.isFinite(Number(age)) ? Number(age) : null;
            const numericGameId = Number.isFinite(Number(gameId)) ? Number(gameId) : null;

            const payload = {
                user_id: userId,
                age: numericAge,
                game_id: numericGameId,
                start_time: new Date().toISOString(),
                score: 0,
                profile_data: urlParams || {}
            };

            try {
                const { data, error } = await supabase
                    .from('game_sessions')
                    .insert(payload)
                    .select('id')
                    .single();

                if (error) {
                    console.error('Failed to create game session:', error);
                    return;
                }

                setGameSessionId(data?.id || null);
                console.log('Created game session:', data?.id);
            } catch (err) {
                console.error('Unexpected error creating game session:', err);
            }
        };

        createSession();
    }, [gameState, userId, age, gameId, urlParams, gameSessionId]);

    // Open survey when game over ONLY if user hasn't completed survey for this game before
    useEffect(() => {
        const checkAndOpenSurvey = async () => {
            if (gameState !== 'win' && gameState !== 'gameover') {
                setIsSurveyOpen(false);
                return;
            }

            console.log('🔍 Checking survey display:', { gameState, gameSessionId, userId, gameId, score });

            try {
                const numericGameId = Number.isFinite(Number(gameId)) ? Number(gameId) : null;

                // If we know the user and game, check historical completion
                if (userId && numericGameId != null) {
                    const { data: history, error: historyError } = await supabase
                        .from('game_sessions')
                        .select('id')
                        .eq('user_id', userId)
                        .eq('game_id', numericGameId)
                        .eq('survey_completed', true)
                        .limit(1);

                    if (!historyError && Array.isArray(history) && history.length > 0) {
                        // User already completed survey for this game before → do not show
                        console.log('❌ Survey already completed for this user and game. Not showing.');
                        setIsSurveyOpen(false);
                        return;
                    }
                }

                // Fallback to current session's completion flag if available
                if (gameSessionId) {
                    const { data, error } = await supabase
                        .from('game_sessions')
                        .select('survey_completed')
                        .eq('id', gameSessionId)
                        .single();
                    if (!error && data) {
                        const completed = Boolean(data?.survey_completed);
                        console.log('📊 Current session survey_completed:', completed, 'Setting isSurveyOpen to:', !completed);
                        setIsSurveyOpen(!completed);
                        return;
                    } else {
                        console.log('⚠️ Could not fetch current session, will show survey');
                    }
                } else {
                    console.log('⚠️ No gameSessionId, will show survey');
                }

                // Default: show if we couldn't verify completion
                console.log('✅ Showing survey (default - no restrictions found)');
                setIsSurveyOpen(true);
            } catch (e) {
                console.error('⚠️ Error checking survey completion:', e);
                console.log('✅ Showing survey (fallback due to error)');
                setIsSurveyOpen(true);
            }
        };

        // Add small delay to ensure end_time update completes first
        const timer = setTimeout(() => {
            checkAndOpenSurvey();
        }, 200);

        return () => clearTimeout(timer);
    }, [gameState, gameSessionId, userId, gameId, score]);

    // Debug: Log isSurveyOpen changes
    useEffect(() => {
        if (gameState === 'win' || gameState === 'gameover') {
            console.log('🔔 isSurveyOpen changed:', isSurveyOpen, 'at gameState:', gameState);
        }
    }, [isSurveyOpen, gameState]);

    // When game ends, update end_time and final score on the session
    useEffect(() => {
        const markEndTime = async () => {
            if ((gameState !== 'win' && gameState !== 'gameover') || !gameSessionId) return;
            try {
                await supabase
                    .from('game_sessions')
                    .update({ end_time: new Date().toISOString(), score })
                    .eq('id', gameSessionId);
            } catch (e) {
                // noop
            }
        };
        markEndTime();
    }, [gameState, gameSessionId, score]);

    // Timer effect
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            playGameOverSound();
            setGameState('gameover');
        }
    }, [gameState, timeLeft, playGameOverSound]);

    const startGame = useCallback(() => {
        playClickSound();
        // Reset gameSessionId to create a new session
        setGameSessionId(null);
        setGameState('playing');
        setScore(0);
        setProgress(0);
        setTimeLeft(INITIAL_TIME);
        setCurrentWordIndex(0);
        setQuestionsAnswered(0);
        setBackgroundOffset(0);
        setRecordingStatus(''); // Clear any previous status
        // Shuffle words for new game
        setShuffledWords(shuffleArray(WORDS_LIST));
    }, [playClickSound]);

    const resetGame = useCallback(() => {
        setGameState('start');
        setScore(0);
        setProgress(0);
        setTimeLeft(INITIAL_TIME);
        setCurrentWordIndex(0);
        setQuestionsAnswered(0);
        setBackgroundOffset(0);
        setShowBullet(false);
        setShowExplosion(false);
        setIsProcessing(false);
        setRecordingStatus('');
        // Reset to new shuffled words
        setShuffledWords(shuffleArray(WORDS_LIST));

        if (isListening) {
            stopListening();
        }
        clearBlob();
    }, [isListening, stopListening, clearBlob]);

    // Handle correct answer
    const handleCorrectAnswer = useCallback(() => {
        if (gameState !== 'playing') return;

        playLaserSound();
        setShowBullet(true);

        setTimeout(() => {
            setShowBullet(false);
            setShowExplosion(true);
            playExplosionSound();

            const newQuestionsAnswered = questionsAnswered + 1;
            const newProgress = (newQuestionsAnswered / TOTAL_QUESTIONS) * 100;
            const newScore = score + 100;

            setQuestionsAnswered(newQuestionsAnswered);
            setProgress(newProgress);
            setScore(newScore);
            setBackgroundOffset(newQuestionsAnswered * 10);
            setCurrentWordIndex((prev) => (prev + 1) % shuffledWords.length);

            setTimeout(() => {
                setShowExplosion(false);
            }, 800);

            if (newQuestionsAnswered >= TOTAL_QUESTIONS) {
                setTimeout(() => {
                    playVictorySound();
                    setGameState('win');
                }, 900);
            }
        }, 300);
    }, [gameState, questionsAnswered, score, playLaserSound, playExplosionSound, playVictorySound]);

    // Simple function to start recording
    const startRecording = useCallback(async () => {
        try {
            // Force stop if already listening/recording
            if (isListening || isRecording) {
                console.log('🛑 Force stopping existing VAD before starting new one');
                await stopListening();
                // Wait a bit for cleanup
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            console.log('🎤 Starting recording...');
            playRecordStartSound();
            setRecordingStatus('Đang ghi... Hãy nói!');
            await startListening();
        } catch (error) {
            console.error('Error starting recording:', error);
            setRecordingStatus('Lỗi khi bắt đầu ghi âm');
        }
    }, [isListening, isRecording, startListening, stopListening, playRecordStartSound]);

    // Process pronunciation - SIMPLIFIED
    const processPronunciation = useCallback(async (audioBlob) => {
        const currentWord = shuffledWords[currentWordIndex];

        try {
            setIsProcessing(true);
            setRecordingStatus('Đang kiểm tra phát âm...');

            const { checkPronunciation } = await import('./utils');
            const result = await checkPronunciation(audioBlob, currentWord, `game-${Date.now()}`);

            if (result && result.total_score !== undefined) {
                const score = result.total_score * 100;
                console.log(`Pronunciation score: ${score} for word: ${currentWord}`);

                if (score >= 50) {
                    // CORRECT - Move to next word
                    playSuccessSound();
                    setRecordingStatus(`Tuyệt vời! Điểm: ${score.toFixed(0)}`);

                    // Calculate new questions count
                    const newQuestionsAnswered = questionsAnswered + 1;
                    console.log('🎯 Correct answer! Moving to next word:', {
                        currentQuestions: questionsAnswered,
                        newQuestions: newQuestionsAnswered,
                        totalQuestions: TOTAL_QUESTIONS,
                        willContinue: newQuestionsAnswered < TOTAL_QUESTIONS
                    });

                    handleCorrectAnswer();

                    // Auto start recording for next word after animation
                    setTimeout(async () => {
                        setRecordingStatus('');
                        if (gameState === 'playing' && newQuestionsAnswered < TOTAL_QUESTIONS) {
                            console.log('🔄 Auto-starting recording for next word');
                            await startRecording();
                        } else {
                            console.log('🏁 Game completed, not starting recording');
                        }
                    }, 1500); // Wait for animation
                } else {
                    // INCORRECT - Try again same word
                    playErrorSound();
                    setRecordingStatus(`Thử lại! Điểm: ${score.toFixed(0)}`);
                    console.log('❌ Incorrect answer, trying again same word');

                    // Auto start recording for same word
                    setTimeout(async () => {
                        setRecordingStatus('');
                        if (gameState === 'playing') {
                            console.log('🔄 Auto-starting recording for same word (try again)');
                            await startRecording();
                        }
                    }, 1000);
                }
            } else {
                // API Error - Try again
                playErrorSound();
                setRecordingStatus('Không thể xử lý âm thanh. Thử lại!');

                setTimeout(async () => {
                    setRecordingStatus('');
                    if (gameState === 'playing') {
                        await startRecording();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Error processing pronunciation:', error);
            playErrorSound();
            setRecordingStatus('Xử lý thất bại. Thử lại!');

            setTimeout(async () => {
                setRecordingStatus('');
                if (gameState === 'playing') {
                    await startRecording();
                }
            }, 1000);
        } finally {
            setIsProcessing(false);
        }
    }, [currentWordIndex, handleCorrectAnswer, playSuccessSound, playErrorSound, gameState, questionsAnswered, startRecording, shuffledWords]);

    // Handle recording completion
    useEffect(() => {
        if (recordingBlob && !isRecording && !isProcessing && processedBlobRef.current !== recordingBlob) {
            if (recordingBlob.size > 1000) {
                console.log('🎤 Processing pronunciation...');
                processedBlobRef.current = recordingBlob;

                const processBlob = async () => {
                    await processPronunciation(recordingBlob);
                    clearBlob();
                    processedBlobRef.current = null;
                };

                processBlob();
            } else {
                console.log('🎤 Blob too small, clearing...');
                clearBlob();
                processedBlobRef.current = null;
            }
        }
    }, [recordingBlob, isRecording, isProcessing, processPronunciation, clearBlob]);

    // Handle VAD errors
    useEffect(() => {
        if (vadError) {
            console.error('VAD Error:', vadError);
            setRecordingStatus('Lỗi VAD: ' + vadError);
        }
    }, [vadError]);

    // Stop VAD when game ends
    useEffect(() => {
        if (gameState === 'win' || gameState === 'gameover') {
            if (isListening) {
                stopListening();
            }
        }
    }, [gameState, isListening, stopListening]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyPress = (event) => {
            // If survey modal is open, let space behave normally (typing in inputs)
            if (isSurveyOpen && event.code === 'Space') {
                return;
            }

            if (gameState === 'start' && event.code === 'Space') {
                playClickSound();
                setGameState('instructions');
            } else if (gameState === 'instructions' && event.code === 'Space') {
                startGame();
            } else if (gameState === 'playing') {
                if (event.code === 'Space') {
                    // Space to start recording
                    startRecording();
                } else if (event.key.toLowerCase() === 'd') {
                    // D key for testing - simulate correct answer
                    handleCorrectAnswer();
                }
            } else if ((gameState === 'win' || gameState === 'gameover') && event.code === 'Space') {
                playClickSound();
                resetGame();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, startRecording, handleCorrectAnswer, startGame, resetGame, playClickSound, isSurveyOpen]);

    // Handle screen navigation
    const handleStartClick = useCallback(() => {
        playClickSound();
        setGameState('instructions');
    }, [playClickSound]);

    const handlePlayAgainClick = useCallback(() => {
        playClickSound();
        resetGame();
    }, [playClickSound, resetGame]);

    const handleCloseSurvey = useCallback(() => {
        setIsSurveyOpen(false);
    }, []);

    const handlePlayAgain = useCallback(() => {
        setIsSurveyOpen(false);
        startGame();
    }, [startGame]);

    const handleExitGame = useCallback(async () => {
        // Update game_sessions to mark that user exited via button
        if (gameSessionId) {
            try {
                await supabase
                    .from('game_sessions')
                    .update({ exited_via_button: true, end_time: new Date().toISOString(), score })
                    .eq('id', gameSessionId);
            } catch (e) {
                console.error('Error updating exited_via_button:', e);
            }
        }
        // Redirect after updating
        window.location.href = 'https://robot-record-web.hacknao.edu.vn/games';
    }, [gameSessionId, score]);

    if (gameState === 'start') {
        return <StartScreen onStart={handleStartClick} onExit={handleExitGame} />;
    }

    if (gameState === 'instructions') {
        return <InstructionScreen onStartGame={startGame} onExit={handleExitGame} />;
    }

    if (gameState === 'win') {
        return (
            <>
                <WinScreen score={score} onPlayAgain={handlePlayAgainClick} onExit={handleExitGame} />
                <SurveyModal
                    isOpen={isSurveyOpen}
                    onClose={handleCloseSurvey}
                    onPlayAgain={handlePlayAgain}
                    gameSessionId={gameSessionId}
                    currentGameId={gameId}
                    userId={userId}
                    age={age}
                    urlParams={urlParams}
                />
            </>
        );
    }

    if (gameState === 'gameover') {
        return (
            <>
                <GameOverScreen score={score} onTryAgain={handlePlayAgainClick} onExit={handleExitGame} />
                <SurveyModal
                    isOpen={isSurveyOpen}
                    onClose={handleCloseSurvey}
                    onPlayAgain={handlePlayAgain}
                    gameSessionId={gameSessionId}
                    currentGameId={gameId}
                    userId={userId}
                    age={age}
                    urlParams={urlParams}
                />
            </>
        );
    }

    return (
        <div className="app">
            <button
                onClick={handleExitGame}
                style={{
                    position: 'fixed',
                    top: '96px',
                    left: '16px',
                    zIndex: 50,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '8px 16px',
                    border: '1px solid #0ea5e9',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}
            >
                ← Thoát game
            </button>
            <BackgroundMusic gameState={gameState} volume={0.05} />
            <Header
                progress={progress}
                timeLeft={timeLeft}
                score={score}
            />
            <GameArea
                backgroundOffset={backgroundOffset}
                showBullet={showBullet}
                showExplosion={showExplosion}
                questionsAnswered={questionsAnswered}
                totalQuestions={TOTAL_QUESTIONS}
                isMoving={showBullet || showExplosion}
            />
            <Footer
                currentWord={shuffledWords[currentWordIndex]}
                isRecording={isRecording}
                isProcessing={isProcessing}
                recordingStatus={recordingStatus}
                vadActive={isListening}
                isListening={isListening}
                onStartRecording={startRecording}
                gameState={gameState}
            />
        </div>
    );
}

export default App;