import { useEffect, useRef } from 'react';

const BackgroundMusic = ({ gameState, volume = 0.1 }) => {
    const audioContextRef = useRef(null);
    const oscillatorsRef = useRef([]);
    const gainNodeRef = useRef(null);

    useEffect(() => {
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                gainNodeRef.current = audioContextRef.current.createGain();
                gainNodeRef.current.connect(audioContextRef.current.destination);
                gainNodeRef.current.gain.value = volume;
            }
        };

        const playAmbientMusic = () => {
            initAudio();

            // Stop any existing oscillators
            oscillatorsRef.current.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            oscillatorsRef.current = [];

            if (gameState === 'playing') {
                // Create ambient space music
                const frequencies = [110, 146.83, 220]; // A2, D3, A3

                frequencies.forEach((freq, index) => {
                    const oscillator = audioContextRef.current.createOscillator();
                    const gainNode = audioContextRef.current.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(gainNodeRef.current);

                    oscillator.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
                    oscillator.type = 'sine';

                    // Create a slow fade in/out pattern
                    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
                    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContextRef.current.currentTime + 2 + index);

                    // Add subtle frequency modulation for space-like effect
                    const lfo = audioContextRef.current.createOscillator();
                    const lfoGain = audioContextRef.current.createGain();
                    lfo.connect(lfoGain);
                    lfoGain.connect(oscillator.frequency);
                    lfo.frequency.setValueAtTime(0.1 + index * 0.05, audioContextRef.current.currentTime);
                    lfoGain.gain.setValueAtTime(2, audioContextRef.current.currentTime);

                    oscillator.start(audioContextRef.current.currentTime);
                    lfo.start(audioContextRef.current.currentTime);

                    oscillatorsRef.current.push(oscillator);
                    oscillatorsRef.current.push(lfo);
                });
            }
        };

        playAmbientMusic();

        return () => {
            // Cleanup on unmount
            oscillatorsRef.current.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
        };
    }, [gameState, volume]);

    return null; // This component doesn't render anything
};

export default BackgroundMusic;