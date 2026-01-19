import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CreateTask() {
  return (
    <ScrollView className="flex-1 bg-gray-900 px-5 pt-6">
      
      <Text className="text-white text-3xl font-bold mb-2">
        Create Task 📝
      </Text>
      <Text className="text-gray-400 mb-6">
        Add a new task to stay consistent
      </Text>

      {/* TASK TITLE */}
      <Text className="text-gray-300 mb-2">Task Title</Text>
      <View className="bg-gray-800 rounded-xl px-4 py-3 mb-5 flex-row items-center">
        <Ionicons name="clipboard-outline" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Eg. Revise React Native"
          placeholderTextColor="#9CA3AF"
          className="text-white ml-3 flex-1"
        />
      </View>

      {/* DESCRIPTION */}
      <Text className="text-gray-300 mb-2">Description</Text>
      <View className="bg-gray-800 rounded-xl px-4 py-3 mb-5">
        <TextInput
          placeholder="What exactly will you do?"
          placeholderTextColor="#9CA3AF"
          className="text-white"
          multiline
        />
      </View>

      {/* PRIORITY */}
      <Text className="text-gray-300 mb-3">Priority</Text>
      <View className="flex-row justify-between mb-8">
        {['Low', 'Medium', 'High'].map(level => (
          <View
            key={level}
            className="bg-gray-800 px-5 py-3 rounded-full"
          >
            <Text className="text-white">{level}</Text>
          </View>
        ))}
      </View>

      {/* CREATE BUTTON */}
      <TouchableOpacity className="bg-blue-500 py-4 rounded-2xl">
        <Text className="text-white text-center font-semibold text-lg">
          Create Task
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
