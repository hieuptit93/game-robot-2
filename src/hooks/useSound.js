import { useRef, useCallback } from 'react';

export const useSound = () => {
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);

    // Initialize audio context
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
            gainNodeRef.current.gain.value = 0.3; // Default volume
        }
        return audioContextRef.current;
    }, []);

    // Create oscillator-based sound
    const createTone = useCallback((frequency, duration, type = 'sine', volume = 0.3) => {
        const audioContext = initAudioContext();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
        
        return oscillator;
    }, [initAudioContext]);

    // Laser shoot sound
    const playLaserSound = useCallback(() => {
        const audioContext = initAudioContext();
        
        // Create a sweeping laser sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }, [initAudioContext]);

    // Explosion sound
    const playExplosionSound = useCallback(() => {
        const audioContext = initAudioContext();
        
        // Create noise for explosion
        const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = audioContext.createBufferSource();
        whiteNoise.buffer = buffer;
        
        // Filter for explosion effect
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
        
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        
        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        whiteNoise.start(audioContext.currentTime);
        whiteNoise.stop(audioContext.currentTime + 0.5);
    }, [initAudioContext]);

    // Success sound
    const playSuccessSound = useCallback(() => {
        const audioContext = initAudioContext();
        
        // Play a chord progression for success
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                createTone(freq, 0.3, 'sine', 0.15);
            }, index * 100);
        });
    }, [initAudioContext, createTone]);

    // Error/fail sound
    const playErrorSound = useCallback(() => {
        createTone(200, 0.5, 'sawtooth', 0.2);
    }, [createTone]);

    // Recording start sound
    const playRecordStartSound = useCallback(() => {
        createTone(440, 0.1, 'sine', 0.1);
        setTimeout(() => createTone(554.37, 0.1, 'sine', 0.1), 100);
    }, [createTone]);

    // Recording stop sound
    const playRecordStopSound = useCallback(() => {
        createTone(554.37, 0.1, 'sine', 0.1);
        setTimeout(() => createTone(440, 0.1, 'sine', 0.1), 100);
    }, [createTone]);

    // Button click sound
    const playClickSound = useCallback(() => {
        createTone(800, 0.1, 'square', 0.1);
    }, [createTone]);

    // Game over sound
    const playGameOverSound = useCallback(() => {
        const frequencies = [440, 415.30, 392, 369.99, 349.23]; // A4 to F4 descending
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                createTone(freq, 0.4, 'triangle', 0.2);
            }, index * 200);
        });
    }, [createTone]);

    // Victory sound
    const playVictorySound = useCallback(() => {
        const melody = [
            { freq: 523.25, duration: 0.2 }, // C5
            { freq: 659.25, duration: 0.2 }, // E5
            { freq: 783.99, duration: 0.2 }, // G5
            { freq: 1046.50, duration: 0.4 } // C6
        ];
        
        melody.forEach((note, index) => {
            setTimeout(() => {
                createTone(note.freq, note.duration, 'sine', 0.2);
            }, index * 150);
        });
    }, [createTone]);

    // Engine/thruster sound (continuous)
    const playEngineSound = useCallback(() => {
        const audioContext = initAudioContext();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        
        // Return stop function
        return () => {
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }, [initAudioContext]);

    return {
        playLaserSound,
        playExplosionSound,
        playSuccessSound,
        playErrorSound,
        playRecordStartSound,
        playRecordStopSound,
        playClickSound,
        playGameOverSound,
        playVictorySound,
        playEngineSound
    };
};