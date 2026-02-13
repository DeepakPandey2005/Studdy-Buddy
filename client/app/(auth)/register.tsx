import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

import { Config } from '../../constants/Config';

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${Config.API_URL}/api/users/register`,
        {
          username: name,
          email,
          password,
        }
      );

      Alert.alert('Success', 'Account created successfully');

      // Redirect to login
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.log(error)
      Alert.alert(
        'Registration Failed',
        error?.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8">
          <View className="items-center mb-10 mt-10">
            <View className="w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Ionicons name="rocket" size={40} color="white" />
            </View>
            <Text className="text-white text-4xl font-bold tracking-tight text-center">
              Get Started
            </Text>
            <Text className="text-gray-400 mt-2 text-base text-center">
              Your journey begins here.
            </Text>
          </View>

          {/* FULL NAME */}
          <View className="mb-4">
            <Text className="text-gray-400 mb-2 ml-1 text-sm font-medium">Full Name</Text>
            <View className="flex-row items-center bg-gray-900 border border-gray-800 px-4 py-4 rounded-2xl">
              <Ionicons name="person-outline" size={22} color="#6366f1" />
              <TextInput
                placeholder="John Doe"
                placeholderTextColor="#64748b"
                className="text-white ml-3 flex-1 text-base"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* EMAIL */}
          <View className="mb-4">
            <Text className="text-gray-400 mb-2 ml-1 text-sm font-medium">Email Address</Text>
            <View className="flex-row items-center bg-gray-900 border border-gray-800 px-4 py-4 rounded-2xl">
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
                placeholder="Create a strong password"
                placeholderTextColor="#64748b"
                className="text-white ml-3 flex-1 text-base"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* REGISTER BUTTON */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
            className={`py-4 rounded-full shadow-lg shadow-indigo-500/20 ${loading ? 'bg-indigo-800' : 'bg-indigo-600'}`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-gray-500 text-base">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text className="text-indigo-400 font-bold text-base">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
