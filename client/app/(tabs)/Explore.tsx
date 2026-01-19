import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUser, removeToken } from '../utils/token';
import { useRouter } from 'expo-router';

export default function Explore() {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Settings',
      icon: 'settings-outline',
      color: 'text-blue-400',
    },
    {
      title: 'Leaderboard',
      icon: 'trophy-outline',
      color: 'text-yellow-400',
    },
    {
      title: 'Feedback',
      icon: 'chatbubble-ellipses-outline',
      color: 'text-green-400',
    },
    {
      title: 'Contact Developer',
      icon: 'mail-outline',
      color: 'text-purple-400',
    },
    {
      title: 'About Study Buddy',
      icon: 'information-circle-outline',
      color: 'text-pink-400',
    },
  ];

  const handleLogout = async () => {
    await removeToken(); // remove token and user info from store
    router.replace('/login');
  };

  return (
    <ScrollView className="flex-1 bg-gray-900 px-4 pt-6">
      
      {/* PROFILE CARD */}
      <View className="bg-gray-800 rounded-3xl p-5 flex-row items-center mb-8">
        
        {/* Avatar */}
        <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white text-2xl font-bold">DP</Text>
        </View>

        {/* User Info */}
        <View className="ml-4 flex-1">
          <Text className="text-white text-xl font-bold">
            {getUser() || 'user'}
          </Text>
          <Text className="text-gray-400">
            Consistency Level: 🔥 High
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
      </View>

      {/* SECTION TITLE */}
      <Text className="text-gray-400 text-sm mb-3 uppercase tracking-wider">
        Explore
      </Text>

      {/* MENU OPTIONS */}
      <View className="bg-gray-800 rounded-3xl overflow-hidden">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center px-5 py-4 border-b border-gray-700 last:border-b-0"
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              className={item.color}
            />

            <Text className="text-white text-base font-medium ml-4 flex-1">
              {item.title}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mt-6 bg-red-600 rounded-3xl px-5 py-4 flex-row items-center justify-center"
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text className="text-white text-base font-medium ml-3">
          Logout
        </Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <Text className="text-gray-500 text-center text-xs mt-10 mb-6">
        Study Buddy v1.0 • Built with ❤️ for students
      </Text>
      
    </ScrollView>
  );
}
