import { Config } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  isCompleted?: boolean;
  steps?: any[];
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

  useEffect(() => {
    // Cast to Task[] for local state
    if (!allTasks) return;
    setTasks(allTasks);
    setLoading(false);
  }, [allTasks]);

  const getStatusColor = (isCompleted?: boolean) => {
    if (isCompleted) return "text-emerald-400";
    return "text-indigo-400";
  };

  const getStatusBg = (isCompleted?: boolean) => {
    if (isCompleted) return "bg-emerald-500/10 border-emerald-500/20";
    return "bg-indigo-500/10 border-indigo-500/20";
  }

  const getProgress = (task: Task) => {
    if (!task.steps || task.steps.length === 0) return 0;
    const done = task.steps.filter((s: any) => s.isDone).length;
    return Math.round((done / task.steps.length) * 100);
  }

  return (
    <View className="flex-1 bg-gray-950">
      {/* HEADER BACKGROUND ACCENT */}
      <View className="absolute top-0 left-0 right-0 h-32 bg-indigo-900/10 rounded-b-[40px]" />

      <View className="px-6 pt-12">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-bold text-white">My Tasks ⚡</Text>
            <Text className="text-gray-400 mt-1 text-sm font-medium">
              Manage your learning path
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(pages)/createTask")}
            className="w-12 h-12 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-500/40"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center mt-20">
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : error ? (
          <View className="items-center mt-20">
            <Text className="text-red-400">{error}</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {tasks.length === 0 ? (
              <View className="items-center justify-center mt-20 opacity-50">
                <Ionicons name="document-text-outline" size={64} color="gray" />
                <Text className="text-gray-500 mt-4">No tasks found. Create one to get started!</Text>
              </View>
            ) : (
              tasks.map((task) => {
                const progress = getProgress(task);
                return (
                  <TouchableOpacity
                    key={task._id}
                    activeOpacity={0.9}
                    onPress={() => router.push({ pathname: "/(pages)/reminder/[id]", params: { id: task._id } })}
                    className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 mb-4 shadow-sm"
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1 pr-4">
                        <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>
                          {task.title}
                        </Text>
                        <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                          {task.isCompleted ? 'Completed' : 'In Progress'}
                        </Text>
                      </View>

                      <View
                        className={`px-3 py-1 rounded-full border ${getStatusBg(task.isCompleted)}`}
                      >
                        <Text className={`text-xs font-bold ${getStatusColor(task.isCompleted)}`}>
                          {progress}%
                        </Text>
                      </View>
                    </View>

                    {task.description ? (
                      <Text className="text-gray-400 text-sm mb-4 leading-5" numberOfLines={2}>
                        {task.description}
                      </Text>
                    ) : null}

                    <View className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
                      <View
                        style={{ width: `${progress}%` }}
                        className={`h-full ${task.isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'} rounded-full`}
                      />
                    </View>

                    <View className="flex-row justify-between items-center pt-2 border-t border-gray-800/50">
                      {task.dueDate ? (
                        <View className="flex-row items-center">
                          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                          <Text className="text-gray-500 text-xs ml-1.5">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        </View>
                      ) : (
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={14} color="#6b7280" />
                          <Text className="text-gray-500 text-xs ml-1.5">No Due Date</Text>
                        </View>
                      )}

                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => router.push({ pathname: "/(pages)/roadmap/[id]", params: { id: task._id } })}
                      >
                        <Text className="text-indigo-400 text-sm font-semibold mr-1">Roadmap</Text>
                        <Ionicons name="arrow-forward" size={14} color="#818cf8" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
