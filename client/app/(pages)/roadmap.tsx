import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Roadmap() {
  const roadmap = [
    { step: 'Basics of React Native', status: 'done' },
    { step: 'UI with NativeWind', status: 'done' },
    { step: 'Navigation & Auth', status: 'current' },
    { step: 'Backend Integration', status: 'locked' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-900 px-5 pt-6">
      
      <Text className="text-white text-3xl font-bold mb-2">
        Your Roadmap 🧭
      </Text>
      <Text className="text-gray-400 mb-8">
        Follow steps to achieve your goal
      </Text>

      {roadmap.map((item, index) => (
        <View
          key={index}
          className="flex-row items-center bg-gray-800 rounded-2xl p-4 mb-4"
        >
          <Ionicons
            name={
              item.status === 'done'
                ? 'checkmark-circle'
                : item.status === 'current'
                ? 'radio-button-on'
                : 'lock-closed-outline'
            }
            size={26}
            color={
              item.status === 'done'
                ? '#22C55E'
                : item.status === 'current'
                ? '#3B82F6'
                : '#6B7280'
            }
          />

          <View className="ml-4">
            <Text className="text-white font-semibold text-lg">
              Step {index + 1}
            </Text>
            <Text className="text-gray-400">
              {item.step}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
