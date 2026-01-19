import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Tasks() {
  const router = useRouter();

  const tasks = [
    {
      id: 1,
      title: 'Revise DSA Arrays',
      description: 'Practice 20 array problems',
      status: 'Pending',
    },
    {
      id: 2,
      title: 'React Native UI',
      description: 'Design login & register screens',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Database Notes',
      description: 'Read MongoDB indexing',
      status: 'Completed',
    },
  ];

  return (
    <View className="flex-1 bg-gray-900 px-4 pt-6">
      
      {/* HEADER */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white">
          Tasks 📋
        </Text>
        <Text className="text-gray-400 mt-1">
          Plan your study tasks efficiently
        </Text>
      </View>

      {/* CREATE TASK BUTTON */}
      <TouchableOpacity
        className="bg-blue-500 rounded-2xl p-4 flex-row items-center justify-center mb-6"
        onPress={() => router.push('/(pages)/createTask')}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text className="text-white text-lg font-semibold ml-2">
          Create New Task
        </Text>
      </TouchableOpacity>

      {/* TASK LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.map(task => (
          <View
            key={task.id}
            className="bg-gray-800 rounded-2xl p-4 mb-4"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white text-lg font-semibold">
                {task.title}
              </Text>

              <View
                className={`px-3 py-1 rounded-full ${
                  task.status === 'Completed'
                    ? 'bg-green-500'
                    : task.status === 'In Progress'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                <Text className="text-xs font-bold text-black">
                  {task.status}
                </Text>
              </View>
            </View>

            <Text className="text-gray-400">
              {task.description}
            </Text>

            {/* ACTIONS: Set Reminder & View */}
            <View className="flex-row justify-end mt-3">
              <TouchableOpacity
                className="bg-indigo-500 px-3 py-2 rounded-full flex-row items-center mr-2"
                onPress={() => router.push('/(pages)/reminder')}
              >
                <Ionicons name="alarm-outline" size={16} color="white" />
                <Text className="text-white text-sm font-semibold ml-2">
                  Set Reminder
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-600 px-3 py-2 rounded-full flex-row items-center"
                onPress={() => router.push('/(pages)/roadmap')}
              >
                <Ionicons name="eye-outline" size={16} color="white" />
                <Text className="text-white text-sm font-semibold ml-2">
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
