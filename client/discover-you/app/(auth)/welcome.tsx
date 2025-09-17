import { View, Text, Button, StyleSheet, Pressable, PanResponder } from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";

export default function Welcome() {
    const router = useRouter();

    const slides = [
        {
            icon: "🧭",
            description: "Discover your strengths and interests with our personalized quizzes.",
        },
        {
            icon: "🎯",
            description: "Set goals and track your progress as you grow.",
        },
        {
            icon: "🚀",
            description: "Unlock your full potential and achieve your dreams!",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const currentSlideRef = useRef(0);

    // Keep ref in sync with state
    currentSlideRef.current = currentSlide;

    const goToNextSlide = useCallback(() => {
        const nextSlide = currentSlideRef.current + 1;
        if (nextSlide < slides.length) {
            setCurrentSlide(nextSlide);
        }
        else {
            setCurrentSlide(0);
        }
    }, [slides.length]);

    const goToPrevSlide = useCallback(() => {
        const prevSlide = currentSlideRef.current - 1;
        if (prevSlide >= 0) {
            setCurrentSlide(prevSlide);
        }
        else {
            setCurrentSlide(slides.length - 1);
        }
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // More lenient horizontal swipe detection
                return (
                    Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && 
                    Math.abs(gestureState.dx) > 10
                );
            },
            onPanResponderGrant: (evt, gestureState) => {
                // Optional: Add haptic feedback or visual indication
            },
            onPanResponderRelease: (evt, gestureState) => {
                const swipeThreshold = 30; // Reduced threshold for easier swiping
                
                if (gestureState.dx < -swipeThreshold) {
                    // Swipe left - go to next slide
                    goToNextSlide();
                } else if (gestureState.dx > swipeThreshold) {
                    // Swipe right - go to previous slide
                    goToPrevSlide();
                }
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Handle gesture termination if needed
            },
        })
    ).current;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <View style={styles.container}>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeContainerSemiTitle}>Welcome to</Text>
                <Text style={styles.welcomeContainerTitle}>DiscoverYou</Text>
                <Text style={styles.welcomeContainerDescription}>Find your potential!</Text>
            </View>
            
            <View style={styles.sliderContainer} {...panResponder.panHandlers}>
                {/* Slider */}
                <View style={styles.slide}>
                    <View style={styles.slideImageContainer}>
                        <Text style={styles.slideImage}>
                            {slides[currentSlide].icon}
                        </Text>
                    </View>
                    <Text style={styles.slideDescription}>
                        {slides[currentSlide].description}
                    </Text>
                </View>
                
                {/* Indicators */}
                <View style={styles.indicatorContainer}>
                    {slides.map((_, idx) => (
                        <Pressable
                            key={idx}
                            onPress={() => setCurrentSlide(idx)}
                            style={[
                                styles.indicator,
                                idx === currentSlide && styles.activeIndicator,
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <Pressable onPress={() => router.push("/(auth)/register")}>
                    <View style={styles.createAccountButton}>
                        <Text style={styles.createAccountButtonText}>Create New Account</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => router.push("/(auth)/login")}>
                    <View style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center"
    },
    welcomeContainer: {
        padding: 42,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeContainerTitle: { 
        fontSize: 36, 
        fontWeight: "bold", 
        color: '#FF6600' 
    },
    welcomeContainerSemiTitle: { 
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: 24, 
        fontWeight: "bold"
    },
    welcomeContainerDescription: { 
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.6)',
        marginTop: 12
    },
    buttonContainer: { 
        width: '100%',
        padding: 12,
    },
    createAccountButton: {
        backgroundColor: '#FF6600',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        margin: 6
    },
    createAccountButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFFFFF'
    },
    loginButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 14,
        alignItems: 'center',
        margin: 6
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
    },
    slide: {
        width: 260,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        padding: 24,
        margin: 16,
    },
    slideImageContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#FFE5D0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    slideImage: {
        fontSize: 80,
    },
    slideDescription: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        margin: 4,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        margin: 4,
    },
    activeIndicator: {
        backgroundColor: '#FF6600',
    },
});