import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

interface AudioPlayerProps {
    uri: string;
}

export default function AudioPlayer({ uri }: AudioPlayerProps) {
    const player = useAudioPlayer(uri);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const subscription = player.addListener('playbackStatusUpdate', (status) => {
            setIsPlaying(status.playing);
            setCurrentTime(status.currentTime);
            setDuration(status.duration);

            // // Reset to beginning when audio ends
            // if (status.currentTime >= status.duration && status.duration > 0) {
            //     setIsPlaying(false);
            //     player.seekTo(0);
            // }
        });

        return () => {
            subscription.remove();
        };
    }, [player]);

    // Load duration on mount
    useEffect(() => {
        if (player.duration > 0) {
            setDuration(player.duration);
        }
    }, [player.duration]);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            player.pause();
        } else {
            // If audio ended, restart from beginning
            if (currentTime >= duration && duration > 0) {
                player.seekTo(0);
            }
            player.play();
        }
    };

    return (
        <View style={styles.audioContainer}>
            <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayPause}
            >
                {
                    isPlaying ?
                        <FontAwesome5 style={styles.playButtonIcon} name="pause" solid />
                        :
                        <FontAwesome5 style={styles.playButtonIcon} name="play" solid />
                }
            </TouchableOpacity>

            <View style={styles.audioInfo}>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeCurrent}>{formatTime(currentTime)}</Text>
                    <Text style={styles.timeTotal}>{formatTime(duration)}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${duration ? (currentTime / duration) * 100 : 0}%` }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.4)'
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FF6600',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonIcon: {
        color: '#FFFFFF',
        fontSize: 16
    },
    audioInfo: {
        flex: 1,
        marginLeft: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#FF6600',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    timeCurrent: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 500
    },
    timeTotal: {
        fontSize: 13,
        color: 'rgba(0,0,0,0.6)',
        fontWeight: 900
    }
});