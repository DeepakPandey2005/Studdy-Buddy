import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../utils/token';

export default function Home() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // Dummy progress data
  const progress = 72;
  const radius = 60;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * progress) / 100;

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuth(!!token); // ✅ TRUE if token exists
    };
    checkAuth();
  }, []);

  // ⏳ Loading while checking token
  if (isAuth === null) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // 🔒 Redirect if not logged in
  if (!isAuth) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-900 px-5 pt-6">
      
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-gray-400 text-base">Welcome back,</Text>
          <Text className="text-white text-3xl font-bold">
            Hello Deepak 👋
          </Text>
        </View>

        <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
          <Ionicons name="person-outline" size={24} color="white" />
        </View>
      </View>

      {/* STREAK CARD */}
      <View className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl p-5 mb-8">
        <Text className="text-white text-lg font-semibold">
          🔥 Study Streak
        </Text>
        <Text className="text-white text-4xl font-bold mt-2">
          6 Days
        </Text>
        <Text className="text-white/80 mt-1">
          Keep going, you’re doing great!
        </Text>
      </View>

      {/* ONGOING TASK */}
      <View className="bg-gray-800 rounded-3xl p-5 mb-8">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-xl font-semibold">
            Ongoing Task
          </Text>

          <TouchableOpacity>
            <Text className="text-blue-400 font-medium">
              View More
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-blue-500 items-center justify-center mr-4">
            <Ionicons name="book-outline" size={22} color="white" />
          </View>

          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              React Native UI Practice
            </Text>
            <Text className="text-gray-400">
              Designing screens using NativeWind
            </Text>
          </View>
        </View>
      </View>

      {/* PROGRESS SECTION */}
      <View className="bg-gray-800 rounded-3xl p-6 items-center mb-10">
        <Text className="text-white text-xl font-semibold mb-4">
          Overall Progress 📊
        </Text>

        <View className="items-center justify-center mb-6">
          <Svg width={150} height={150}>
            <Circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#374151"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="75"
              cy="75"
              r={radius}
              stroke="#3B82F6"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="75, 75"
            />
          </Svg>

          <View className="absolute items-center">
            <Text className="text-white text-3xl font-bold">
              {progress}%
            </Text>
            <Text className="text-gray-400 text-sm">
              Completed
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View className="flex-row justify-between w-full">
          <View className="items-center">
            <Text className="text-white font-bold text-lg">5</Text>
            <Text className="text-gray-400 text-sm">Total</Text>
          </View>
          <View className="items-center">
            <Text className="text-green-400 font-bold text-lg">3</Text>
            <Text className="text-gray-400 text-sm">Done</Text>
          </View>
          <View className="items-center">
            <Text className="text-yellow-400 font-bold text-lg">2</Text>
            <Text className="text-gray-400 text-sm">Pending</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
