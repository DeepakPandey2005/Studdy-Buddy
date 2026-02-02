import { Config } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getToken } from "../utils/token";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks } from "../store/tasksSlice";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  dueDate?: string;
  createdAt?: string;
};

export default function Tasks() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const dispatch = useDispatch<AppDispatch>();
  const allTasks = useSelector((state: RootState) => state.tasks.list) as any[];

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // use task from redux store instead of fetching manually
  useEffect(() => {
    if (!allTasks) return;
    setTasks(allTasks);
    setLoading(false);
  }, [ allTasks]);


  const getStatusColor = (status?: string) => {
    const s = (status ?? "").toLowerCase();
    if (s.includes("complete")) return "bg-green-500";
    if (s.includes("progress")) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusLabel = (status?: string) => {
    const s = (status ?? "").toLowerCase();
    if (s.includes("complete")) return "Completed";
    if (s.includes("progress")) return "In Progress";
    if (s === "pending" || s === "") return "Pending";
    // fallback: capitalize first letter
    return status ? status[0].toUpperCase() + status.slice(1) : "Pending";
  };

  return (
    <View className="flex-1 bg-gray-900 px-4 pt-6">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white">Tasks 📋</Text>
        <Text className="text-gray-400 mt-1">
          Plan your study tasks efficiently
        </Text>
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-2xl p-4 flex-row items-center justify-center mb-6"
        onPress={() => router.push("/(pages)/createTask")}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text className="text-white text-lg font-semibold ml-2">
          Create New Task
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : error ? (
        <View className="items-center">
          <Text className="text-red-400">{error}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {tasks.map((task) => (
            <View key={task._id} className="bg-gray-800 rounded-2xl p-4 mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white text-lg font-semibold">
                  {task.title}
                </Text>

                <View
                  className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}
                >
                  <Text className="text-xs font-bold text-black">
                    {getStatusLabel(task.status)}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-400">{task.description}</Text>

              {task.dueDate ? (
                <Text className="text-gray-400 mt-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              ) : null}

              <View className="flex-row justify-end mt-3">
                <TouchableOpacity
                  className="bg-indigo-500 px-3 py-2 rounded-full flex-row items-center mr-2"
                  onPress={() =>
                    router.push({
                      pathname: "/(pages)/reminder/[id]",
                      params: { id: task._id },
                    })
                  }
                >
                  <Ionicons name="alarm-outline" size={16} color="white" />
                  <Text className="text-white text-sm font-semibold ml-2">
                    Set Reminder
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-green-600 px-3 py-2 rounded-full flex-row items-center"
                  onPress={() =>
                    router.push({
                      pathname: "/(pages)/roadmap/[id]",
                      params: { id: task._id },
                    })
                  }
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
      )}
    </View>
  );
}
