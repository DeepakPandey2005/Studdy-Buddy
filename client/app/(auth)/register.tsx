import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
    <View className="flex-1 bg-gray-900 px-6 justify-center">

      {/* TITLE */}
      <Text className="text-white text-3xl font-bold">
        Create Account 🚀
      </Text>
      <Text className="text-gray-400 mt-1 mb-8">
        Start your learning journey
      </Text>

      {/* FULL NAME */}
      <View className="flex-row items-center bg-gray-800 px-4 py-3 rounded-xl mb-4">
        <Ionicons name="person-outline" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          className="text-white ml-3 flex-1"
          value={name}
          onChangeText={setName}
        />
      </View>

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

      {/* REGISTER BUTTON */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className={`py-4 rounded-2xl ${loading ? 'bg-green-400' : 'bg-green-500'
          }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? 'Creating Account...' : 'Register'}
        </Text>
      </TouchableOpacity>

      {/* LOGIN LINK */}
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/login')}
        className="mt-6"
      >
        <Text className="text-gray-400 text-center">
          Already have an account?{' '}
          <Text className="text-green-400 font-semibold">Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
