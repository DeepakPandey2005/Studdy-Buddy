import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { saveToken } from '../utils/token';
import axios from 'axios';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'http://192.168.0.108:5000/api/users/login',
        {
          email,
          password,
        }
      );

      // Backend should return token + user
      const { token, email:userEmail } = response.data;



      Alert.alert('Success', 'Login successful');

      // 🔒 JWT storage (we will improve this next)
      await saveToken(token, response.data.username);
    
      // For now just redirect
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error)
      Alert.alert(
        'Login Failed',
        error?.response?.data?.message || 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 px-6 justify-center">
      
      {/* TITLE */}
      <Text className="text-white text-3xl font-bold">
        Welcome Back 👋
      </Text>
      <Text className="text-gray-400 mt-1 mb-8">
        Login to continue
      </Text>

      {/* EMAIL */}
      <View className="flex-row items-center bg-gray-800 px-4 py-3 rounded-xl mb-4">
        <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          className="text-white ml-3 flex-1"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* PASSWORD */}
      <View className="flex-row items-center bg-gray-800 px-4 py-3 rounded-xl mb-6">
        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          className="text-white ml-3 flex-1"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`py-4 rounded-2xl ${
          loading ? 'bg-blue-400' : 'bg-blue-500'
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* REGISTER LINK */}
      <TouchableOpacity
        onPress={() => router.push('/(auth)/register')}
        className="mt-6"
      >
        <Text className="text-gray-400 text-center">
          Don’t have an account?{' '}
          <Text className="text-blue-400 font-semibold">Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
