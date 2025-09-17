import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.semiTitle}>Welcome back to</Text>
        <Text style={styles.title}>DiscoverYou</Text>
        <Text style={styles.subtitle}>Find your potential!</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
        <Pressable style={styles.loginButton} onPress={() => { }}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.registerText}>Don't have an account? <Text style={styles.registerLink}>Register</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  headerContainer: {
    padding: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semiTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 2
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    margin: 2,
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
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  input: {
    width: '90%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 14,
    marginVertical: 8,
    fontSize: 16,
    color: '#222',
  },
  loginButton: {
    backgroundColor: '#FF6600',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
    width: '90%',
  },
  loginButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  registerText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  registerLink: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
});
