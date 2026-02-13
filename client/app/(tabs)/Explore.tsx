import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser, removeToken } from '../utils/token';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Explore() {
  const router = useRouter();
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const fetchUser = async () => {
      const u = await getUser();
      setUsername(u || 'User');
    }
    fetchUser();
  }, []);

  const menuItems = [
    {
      title: 'Settings',
      icon: 'settings-outline',
      color: 'text-gray-400',
    },
    {
      title: 'Leaderboard',
      icon: 'trophy-outline',
      color: 'text-amber-400',
    },
    {
      title: 'Feedback',
      icon: 'chatbubble-ellipses-outline',
      color: 'text-indigo-400',
    },
    {
      title: 'Contact Developer',
      icon: 'mail-outline',
      color: 'text-cyan-400',
    },
    {
      title: 'About Study Buddy',
      icon: 'information-circle-outline',
      color: 'text-pink-400',
    },
  ];

  const handleLogout = async () => {
    await removeToken(); // remove token and user info from store
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 bg-gray-950 px-6 pt-12">

      <View className="items-center mb-10">
        <View className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 items-center justify-center mb-4 shadow-xl shadow-indigo-500/20 border-4 border-gray-900">
          <Text className="text-white text-3xl font-bold">{username[0].toUpperCase()}</Text>
        </View>
        <Text className="text-white text-2xl font-bold mb-1">
          {username}
        </Text>
        <View className="bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          <Text className="text-indigo-400 text-xs font-semibold">Scholar 🎓</Text>
        </View>
      </View>

      {/* STATS ROW */}
      <View className="flex-row justify-between mb-8 bg-gray-900/50 p-4 rounded-3xl border border-gray-800">
        <View className="items-center flex-1 border-r border-gray-800">
          <Text className="text-gray-400 text-xs uppercase mb-1">Studied</Text>
          <Text className="text-white text-xl font-bold">12h</Text>
        </View>
        <View className="items-center flex-1 border-r border-gray-800">
          <Text className="text-gray-400 text-xs uppercase mb-1">Tasks</Text>
          <Text className="text-white text-xl font-bold">5</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-gray-400 text-xs uppercase mb-1">Streak</Text>
          <Text className="text-white text-xl font-bold">6🔥</Text>
        </View>
      </View>

      {/* SECTION TITLE */}
      <Text className="text-gray-500 text-xs font-bold mb-4 uppercase tracking-widest ml-1">
        Account
      </Text>

      {/* MENU OPTIONS */}
      <View className="bg-gray-900 rounded-3xl overflow-hidden mb-8 border border-gray-800">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center px-5 py-5 ${index !== menuItems.length - 1 ? 'border-b border-gray-800' : ''}`}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              className={item.color}
            />

            <Text className="text-gray-200 text-base font-medium ml-4 flex-1">
              {item.title}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4b5563"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.8}
        className="mb-20 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 flex-row items-center justify-center"
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text className="text-red-400 text-base font-semibold ml-3">
          Sign Out
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
