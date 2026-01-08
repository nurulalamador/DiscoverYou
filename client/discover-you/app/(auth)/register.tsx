import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { serverUrl } from "@/components/constants";
import { FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";


export default function Register() {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: null as Date | null,
    gender: "male"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  function handleInputChange(name: string, value: any) {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function toggleRememberMe() {
    setShowTerms(prev => !prev);
  }

  function handleSubmit() {
    if (!formData.email) {
      setErrorMessage("Please enter your email.");
      return;
    }
    if (!formData.username) {
      setErrorMessage("Please choose a username.");
      return;
    }
    if (!formData.fullName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!formData.dateOfBirth) {
      setErrorMessage("Please select your date of birth.");
      return;
    }
    if (!formData.password) {
      setErrorMessage("Please create a password.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Confirm passwords do not match.");
      return;
    }
    if (!showTerms) {
      setErrorMessage("You must agree to the terms and conditions.");
      return;
    }

    console.log("Submitting form data:", formData);

    fetch(`${serverUrl}/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        dateOfBirth: formData.dateOfBirth.toISOString().split("T")[0],
        gender: formData.gender
      }),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Login response data:", data);
        if (data.success) {
          setRegisterSuccess(true);
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

  if (registerSuccess) {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.successContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>EmBridge</Text>
        </View>
        <View style={styles.welcomeTextContainer}>
          <FontAwesome6 name="circle-check" size={180} color="#4BB543" solid />
          <Text style={styles.successTitle}>Registration Successful!</Text>
          <Text style={styles.successSemiTitle}>You can now login to your account.</Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.loginButtonText}>Login to Your Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>EmBridge</Text>
        </View>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.title}>Create New Account</Text>
          <Text style={styles.semiTitle}>Please create account to continue</Text>
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
            <Text style={styles.labelTitle}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="rgba(0,0,0,0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
              nativeID="email"
              onChangeText={(value) => handleInputChange("email", value)}
            />
          </View>
          <View style={styles.label}>
            <Text style={styles.labelTitle}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor="rgba(0,0,0,0.5)"
              keyboardType="default"
              autoCapitalize="none"
              nativeID="username"
              onChangeText={(value) => handleInputChange("username", value)}
            />
          </View>
          <View style={styles.label}>
            <Text style={styles.labelTitle}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(0,0,0,0.5)"
              keyboardType="default"
              autoCapitalize="none"
              nativeID="fullName"
              onChangeText={(value) => handleInputChange("fullName", value)}
            />
          </View>
          <View style={styles.label}>
            <Text style={styles.labelTitle}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={formData.gender == "male" ? styles.genderActive : styles.gender}
                onPress={() => handleInputChange("gender", "male")}
              >
                <FontAwesome6 name="person" size={28} color={formData.gender == "male" ? "#EE0000" : "rgba(0,0,0,0.6)"} solid />
                <Text style={formData.gender == "male" ? styles.genderTextActive : styles.genderText}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={formData.gender == "female" ? styles.genderActive : styles.gender}
                onPress={() => handleInputChange("gender", "female")}
              >
                <FontAwesome6 name="person-dress" size={28} color={formData.gender == "female" ? "#EE0000" : "rgba(0,0,0,0.6)"} solid />
                <Text style={formData.gender == "female" ? styles.genderTextActive : styles.genderText}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.label}>
            <Text style={styles.labelTitle}>Date of Birth</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowDate(true)}
            >
              <Text style={{ color: formData.dateOfBirth ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', fontSize: 16 }}>
                {formData.dateOfBirth ? formData.dateOfBirth?.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", }) : "Select your date of birth"}
              </Text>
            </Pressable>
            {showDate && <DateTimePicker
              value={formData.dateOfBirth ? formData.dateOfBirth : new Date(2000, 0, 1)}
              mode="date"
              display="spinner"
              // onChange={onChange}
              onChange={(event, selectedDate) => {
                setShowDate(false);
                if (selectedDate) handleInputChange("dateOfBirth", selectedDate);
              }}
            />}

          </View>
          <View style={styles.label}>
            <Text style={styles.labelTitle}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="rgba(0,0,0,0.5)"
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
          <View style={styles.label}>
            <Text style={styles.labelTitle}>Confirm Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="rgba(0,0,0,0.5)"
                secureTextEntry={!showConfirmPassword}
                nativeID="confirmPassword"
                onChangeText={(value) => handleInputChange("confirmPassword", value)}
                value={formData.confirmPassword}
              />
              <Pressable
                style={styles.inputEye}
                onPress={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              >
                {showConfirmPassword ?
                  <FontAwesome6 name="eye" size={20} color="rgba(0,0,0,0.6)" /> :
                  <FontAwesome6 name="eye-slash" size={20} color="rgba(0,0,0,0.6)" />
                }
              </Pressable>
            </View>
          </View>
          <View style={styles.rememberMeForgetPasswordContainer}>
            <View style={styles.rememberMeContainer}>
              <Pressable
                style={showTerms ? styles.checkboxActive : styles.checkbox}
                onPress={toggleRememberMe}
              >
                {showTerms && (
                  <Text style={styles.checkboxTick}>✓</Text>
                )}
              </Pressable>
              <View style={styles.rememberMeTextContainer}>
                <Text style={styles.rememberMeText}>I agree to the</Text>
                <TouchableOpacity>
                  <Text style={styles.termAndCondtion}>Term & Conditions</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have account?</Text>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.linkPressable}>Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    gap: 12,
  },
  headerContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0
  },
  logo: {
    width: 260,
    marginTop: 48,
    alignContent: 'center',
    alignItems: 'center',
    fontSize: 38,
    fontWeight: 'bold',
    color: '#EE0000',
    textAlign: 'center',
  },
  welcomeTextContainer: {
    padding: 8,
    paddingTop: 0,
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
    color: '#EE0000'
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    margin: 2
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    color: 'rgba(0,0,0,0.8)',
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  gender: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 12,
    paddingTop: 18,
    marginVertical: 8,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    alignItems: 'center',
  },
  genderActive: {
    flex: 1,
    backgroundColor: '#EE00000d',
    borderRadius: 8,
    padding: 12,
    paddingTop: 18,
    marginVertical: 8,
    borderColor: '#EE0000',
    borderWidth: 1,
    alignItems: 'center',
  },
  genderText: {
    marginTop: 8,
    color: 'rgba(0,0,0,0.6)',
    fontSize: 14
  },
  genderTextActive: {
    marginTop: 8,
    color: '#EE0000',
    fontSize: 14,
    fontWeight: "bold"
  },
  inputEye: {
    position: "absolute",
    right: 12,
    top: 22,
    padding: 2,
  },
  loginButton: {
    backgroundColor: '#EE0000',
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
    backgroundColor: false ? "#EE0000" : "#fff",
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
    backgroundColor: "#EE0000"
  },
  checkboxTick: {
    color: "#FFFFFF",
    fontSize: 12
  },
  rememberMeTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rememberMeText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)'
  },
  termAndCondtion: {
    color: "#EE0000",
    fontWeight: "bold",
    fontSize: 14,
    marginHorizontal: 4
  },
  forgetPassword: {
    color: "#EE0000",
    fontWeight: "bold",
    fontSize: 14
  },
  bottomContainer: {
    paddingBottom: 24,
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
    color: '#EE0000',
    fontWeight: 'bold',
    marginHorizontal: 6,
    fontSize: 15
  },
  successContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: "center",
    backgroundColor: "#fff"
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    color: 'rgba(0, 0, 0, 0.8)',
    textAlign: 'center'
  },
  successSemiTitle: {
    fontSize: 15,
    marginTop: 8,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center'
  },
});
