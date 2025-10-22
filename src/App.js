import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header/Header';
import GameArea from './components/GameArea/GameArea';
import Footer from './components/Footer/Footer';
import StartScreen from './components/Screens/StartScreen';
import InstructionScreen from './components/Screens/InstructionScreen';
import WinScreen from './components/Screens/WinScreen';
import GameOverScreen from './components/Screens/GameOverScreen';
import { usePronunciationScoring } from './hooks/usePronunciationScoring';
import { useSound } from './hooks/useSound';
import BackgroundMusic from './components/BackgroundMusic/BackgroundMusic';
import './App.css';

const WORDS_LIST = [
    'ATTACK', 'DEFEND', 'SPACE', 'ROCKET', 'PLANET', 'GALAXY', 'LASER', 'SHIELD',
    'ENERGY', 'POWER', 'FLIGHT', 'MISSION', 'TARGET', 'COMBAT', 'VICTORY'
];

const TOTAL_QUESTIONS = 10;
const INITIAL_TIME = 120; // 2 minutes

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
        setGameState('playing');
        setScore(0);
        setProgress(0);
        setTimeLeft(INITIAL_TIME);
        setCurrentWordIndex(0);
        setQuestionsAnswered(0);
        setBackgroundOffset(0);
        setRecordingStatus('Press SPACE to start recording');
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
            setCurrentWordIndex((prev) => (prev + 1) % WORDS_LIST.length);

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
            setRecordingStatus('Recording... Speak now!');
            await startListening();
        } catch (error) {
            console.error('Error starting recording:', error);
            setRecordingStatus('Error starting recording');
        }
    }, [isListening, isRecording, startListening, stopListening, playRecordStartSound]);

    // Process pronunciation - SIMPLIFIED
    const processPronunciation = useCallback(async (audioBlob) => {
        const currentWord = WORDS_LIST[currentWordIndex];

        try {
            setIsProcessing(true);
            setRecordingStatus('Checking pronunciation...');

            const { checkPronunciation } = await import('./utils');
            const result = await checkPronunciation(audioBlob, currentWord, `game-${Date.now()}`);

            if (result && result.total_score !== undefined) {
                const score = result.total_score * 100;
                console.log(`Pronunciation score: ${score} for word: ${currentWord}`);

                if (score >= 50) {
                    // CORRECT - Move to next word
                    playSuccessSound();
                    setRecordingStatus(`Great! Score: ${score.toFixed(0)}`);
                    
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
                    setRecordingStatus(`Try again! Score: ${score.toFixed(0)}`);
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
                setRecordingStatus('Could not process audio. Try again!');

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
            setRecordingStatus('Processing failed. Try again!');

            setTimeout(async () => {
                setRecordingStatus('');
                if (gameState === 'playing') {
                    await startRecording();
                }
            }, 1000);
        } finally {
            setIsProcessing(false);
        }
    }, [currentWordIndex, handleCorrectAnswer, playSuccessSound, playErrorSound, gameState, questionsAnswered, startRecording]);

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
            setRecordingStatus('VAD Error: ' + vadError);
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
    }, [gameState, startRecording, handleCorrectAnswer, startGame, resetGame, playClickSound]);

    if (gameState === 'start') {
        return <StartScreen />;
    }

    if (gameState === 'instructions') {
        return <InstructionScreen />;
    }

    if (gameState === 'win') {
        return <WinScreen score={score} />;
    }

    if (gameState === 'gameover') {
        return <GameOverScreen score={score} />;
    }

    return (
        <div className="app">
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
                currentWord={WORDS_LIST[currentWordIndex]}
                isRecording={isRecording}
                isProcessing={isProcessing}
                recordingStatus={recordingStatus}
                vadActive={isListening}
                isListening={isListening}
            />
        </div>
    );
}

export default App;