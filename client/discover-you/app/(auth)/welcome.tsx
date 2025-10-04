import { View, Text, StyleSheet, Pressable, PanResponder, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState, useCallback, useEffect } from "react";
import { Image } from "expo-image";
// import welcomeScreen1 from "../../assets/welcomeScreen1.png";

export default function Welcome() {
    const router = useRouter();

    const slides = [
        {
            image: require("../../assets/images/welcomeScreen1.png"),
            description: "Discover and explore your strengths and interests.",
        },
        {
            image: require("../../assets/images/welcomeScreen2.png"),
            description: "Set goals and track your progress as you grow.",
        },
        {
            image: require("../../assets/images/welcomeScreen3.png"),
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
        }, 5000);
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
                        <Image
                            source={slides[currentSlide].image}
                            style={styles.slideImage}
                            contentFit="contain"
                        />
                    </View>
                    <Text style={styles.slideDescription}>
                        {slides[currentSlide].description}
                    </Text>
                </View>

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
                <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push("/(auth)/register")}>
                    <Text style={styles.createAccountButtonText}>Create New Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/(auth)/login")}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF"
    },
    welcomeContainer: {
        marginTop: 42,
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
        padding: 14,
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
        color: 'rgba(0, 0, 0, 0.6)',
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
        // backgroundColor: "blue"
    },
    slide: {
        width: 260,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        padding: 24,
    },
    slideImageContainer: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: '#FFE5D0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    slideImage: { 
        transform: "scale(1.4)", 
        width: '100%', 
        height: '100%'
    },
    slideDescription: {
        fontSize: 15,
        color: 'rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        margin: 4,
        // backgroundColor: "red"
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "red"
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#FF6600',
    },
});