import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { serverUrl } from "@/components/constants";
import { useAuth } from "../authContext";
import { FontAwesome6 } from "@expo/vector-icons";


export default function Login() {
  const { setIsAuthenticated } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleInputChange(name: string, value: string) {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function toggleRememberMe() {
    setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }));
  }

  function handleSubmit() {
    console.log("Submitting form data:", formData);

    fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Login response data:", data);
        if (data.success) {
          console.log("Login Successful", "Welcome back!");
          setIsAuthenticated(true);
        }
        else {
          setErrorMessage(data.message || "Something went wrong.");
        }
        // console.log("Login successful:", data);
        // // You can store token or user info here if needed
        // Alert.alert("Login Successful", "Welcome back!");
        // // Navigate to home or dashboard
        // // router.replace("/home");
      })
      .catch(error => {
        console.error("Login error:", error);
        setErrorMessage("Something went wrong. Please try again.");
      });
  }

  const router = useRouter();

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/logoOrange.svg")}
          style={styles.logo}
        />
      </View>
      <View style={styles.welcomeTextContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.semiTitle}>Please login to continue</Text>
      </View>

      <View style={styles.formContainer}>
        {
          errorMessage && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorMessageText}>{errorMessage}</Text>
            </View>
          )
        }
        <View style={styles.label}>
          <Text style={styles.labelTitle}>Email or Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email or username"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            nativeID="email"
            onChangeText={(value) => handleInputChange("email", value)}
          />
        </View>
        <View style={styles.label}>
          <Text style={styles.labelTitle}>Password</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              nativeID="password"
              onChangeText={(value) => handleInputChange("password", value)}
              value={formData.password}
            />
            <Pressable
              style={styles.inputEye}
              onPress={() =>
                setShowPassword((prev) => !prev)
              }
            >
              {showPassword ?
                <FontAwesome6 name="eye" size={20} color="rgba(0,0,0,0.6)" /> :
                <FontAwesome6 name="eye-slash" size={20} color="rgba(0,0,0,0.6)" />
              }
            </Pressable>
          </View>
        </View>
        <View style={styles.rememberMeForgetPasswordContainer}>
          <View style={styles.rememberMeContainer}>
            <Pressable
              style={formData.rememberMe ? styles.checkboxActive : styles.checkbox}
              onPress={toggleRememberMe}
            >
              {formData.rememberMe && (
                <Text style={styles.checkboxTick}>✓</Text>
              )}
            </Pressable>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </View>
          <Pressable onPress={() => { /* handle forgot password navigation */ }}>
            <Text style={styles.forgetPassword}>Forgot Password?</Text>
          </Pressable>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account?</Text>
          <Pressable onPress={() => router.replace("/(auth)/register")}>
            <Text style={styles.linkPressable}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: "center",
    backgroundColor: "#fff"
  },
  headerContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 100,
    resizeMode: 'contain',
    marginTop: 24
  },
  welcomeTextContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semiTitle: {
    fontSize: 16,
    margin: 2,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 4,
    color: '#FF6600'
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    margin: 2
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 24
  },
  label: {
    width: '100%',
    margin: 4,
  },
  labelTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: 'rgba(0,0,0,0.6)',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    fontSize: 16,
    color: '#222',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  inputEye: {
    position: "absolute",
    right: 12,
    top: 22,
    padding: 2,
  },
  loginButton: {
    backgroundColor: '#FF6600',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
    width: '100%',
  },
  loginButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorMessage: {
    backgroundColor: 'rgba(220,0,0,0.2)',
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12
  },
  errorMessageText: {
    color: 'rgba(220,0,0,1)'
  },
  rememberMeForgetPasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 10
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: false ? "#FF6600" : "#fff",
  },
  checkboxActive: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#FF6600"
  },
  checkboxTick: {
    color: "#FFFFFF",
    fontSize: 12
  },
  rememberMeText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  forgetPassword: {
    color: "#FF6600",
    fontWeight: "bold",
    fontSize: 14
  },
  bottomContainer: {
    padding: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: 14,
  },
  linkPressable: {
    color: '#FF6600',
    fontWeight: 'bold',
    marginHorizontal: 6,
    fontSize: 15
  },
});
