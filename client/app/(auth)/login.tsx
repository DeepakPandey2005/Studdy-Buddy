import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { saveToken } from '../utils/token';
import axios from 'axios';

import { Config } from '../../constants/Config';

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
        `${Config.API_URL}/api/users/login`,
        {
          email,
          password,
        }
      );

      // Backend should return token + user
      const { token } = response.data;

      Alert.alert('Success', 'Welcome back!');

      // 🔒 JWT storage
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
    <SafeAreaView className="flex-1 bg-gray-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <Ionicons name="sparkles" size={40} color="white" />
          </View>
          <Text className="text-white text-4xl font-bold tracking-tight text-center">
            Welcome Back
          </Text>
          <Text className="text-gray-400 mt-2 text-base text-center">
            Sign in to continue your progress
          </Text>
        </View>

        {/* EMAIL */}
        <View className="mb-4">
          <Text className="text-gray-400 mb-2 ml-1 text-sm font-medium">Email Address</Text>
          <View className="flex-row items-center bg-gray-900 border border-gray-800 px-4 py-4 rounded-2xl focus:border-indigo-500">
            <Ionicons name="mail-outline" size={22} color="#6366f1" />
            <TextInput
              placeholder="hello@example.com"
              placeholderTextColor="#64748b"
              className="text-white ml-3 flex-1 text-base"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* PASSWORD */}
        <View className="mb-8">
          <Text className="text-gray-400 mb-2 ml-1 text-sm font-medium">Password</Text>
          <View className="flex-row items-center bg-gray-900 border border-gray-800 px-4 py-4 rounded-2xl">
            <Ionicons name="lock-closed-outline" size={22} color="#6366f1" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#64748b"
              className="text-white ml-3 flex-1 text-base"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
          className={`py-4 rounded-full shadow-lg shadow-indigo-500/20 ${loading ? 'bg-indigo-800' : 'bg-indigo-600'}`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? 'Logging in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* REGISTER LINK */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500 text-base">
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text className="text-indigo-400 font-bold text-base">Create Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
