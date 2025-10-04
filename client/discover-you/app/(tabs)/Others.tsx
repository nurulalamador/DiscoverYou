import { serverUrl } from "@/components/constants";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import useAuth from "../authContext";

export default function Others() {
  const { setIsAuthenticated } = useAuth();

  function handleLogout() {
    fetch(`${serverUrl}/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("Login response data:", data);
        if (data.success) {
          setIsAuthenticated(false);
        }
        else {
          // setErrorMessage(data.message || "Something went wrong.");
        }
        // console.log("Login successful:", data);
        // // You can store token or user info here if needed
        // Alert.alert("Login Successful", "Welcome back!");
        // // Navigate to home or dashboard
        // // router.replace("/home");
      })
      .catch(error => {
        console.error("Login error:", error);
        // setErrorMessage("Something went wrong. Please try again.");
      });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#EEEEEE' }}>
      <Text>Others</Text>
      <TouchableOpacity style={{backgroundColor: "#FF6600", padding: 10, borderRadius: 8}} onPress={handleLogout}>
        <Text style={{color: "#FFFFFF"}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}