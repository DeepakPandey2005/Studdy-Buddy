import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Reminder() {
  return (
    <View className="flex-1 bg-gray-900 px-5 pt-6">
      
      <Text className="text-white text-3xl font-bold mb-2">
        Set Reminder ⏰
      </Text>
      <Text className="text-gray-400 mb-8">
        Never miss your study time
      </Text>

      {/* TIME CARD */}
      <View className="bg-gray-800 rounded-3xl p-6 items-center mb-6">
        <Ionicons name="time-outline" size={42} color="#60A5FA" />
        <Text className="text-white text-2xl font-bold mt-3">
          07:00 PM
        </Text>
        <Text className="text-gray-400">
          Daily Study Reminder
        </Text>
      </View>

      {/* DAYS */}
      <Text className="text-gray-300 mb-3">Repeat On</Text>
      <View className="flex-row flex-wrap gap-3 mb-10">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => (
          <View
            key={day}
            className="bg-gray-800 px-4 py-2 rounded-full"
          >
            <Text className="text-white">{day}</Text>
          </View>
        ))}
      </View>

      {/* SET BUTTON */}
      <TouchableOpacity className="bg-green-500 py-4 rounded-2xl">
        <Text className="text-white text-center font-semibold text-lg">
          Set Reminder
        </Text>
      </TouchableOpacity>
    </View>
  );
}
