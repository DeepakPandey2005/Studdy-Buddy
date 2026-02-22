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
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchTasks } from "../store/tasksSlice";
import { PremiumBackground } from "../components/PremiumBackground";

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
    <PremiumBackground>
      <View className="flex-1">
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
                  <Text className="text-gray-500 mt-4 font-medium italic">No tasks found. Create one to get started!</Text>
                </View>
              ) : (
                tasks.map((task, index) => {
                  const progress = getProgress(task);

                  // --- ENTRY ANIMATION ---
                  const fadeAnim = new Animated.Value(0);
                  const slideAnim = new Animated.Value(20);

                  Animated.parallel([
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 500,
                      delay: index * 100,
                      useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                      toValue: 0,
                      duration: 500,
                      delay: index * 100,
                      useNativeDriver: true,
                    })
                  ]).start();

                  return (
                    <Animated.View
                      key={task._id}
                      style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push({ pathname: "/(pages)/reminder/[id]", params: { id: task._id } })}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-5 overflow-hidden shadow-2xl"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(10px)', // For web, but we'll use border/transparency for native
                        }}
                      >
                        {/* Decorative internal glow */}
                        <View className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />

                        <View className="flex-row justify-between items-start mb-4">
                          <View className="flex-1 pr-4">
                            <Text className="text-white text-xl font-bold tracking-tight mb-1" numberOfLines={1}>
                              {task.title}
                            </Text>
                            <View className="flex-row items-center">
                              <View className={`w-2 h-2 rounded-full mr-2 ${task.isCompleted ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                              <Text className={`${task.isCompleted ? 'text-emerald-400/80' : 'text-indigo-400/80'} text-[10px] font-bold uppercase tracking-widest`}>
                                {task.isCompleted ? 'Mission Accomplished' : 'Evolving Now'}
                              </Text>
                            </View>
                          </View>

                          <View
                            className={`px-3 py-1.5 rounded-xl border ${getStatusBg(task.isCompleted)}`}
                          >
                            <Text className={`text-xs font-black ${getStatusColor(task.isCompleted)}`}>
                              {progress}%
                            </Text>
                          </View>
                        </View>

                        {task.description ? (
                          <Text className="text-gray-300/60 text-sm mb-5 leading-5 font-medium" numberOfLines={2}>
                            {task.description}
                          </Text>
                        ) : null}

                        <View className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-5">
                          <View
                            style={{ width: `${progress}%` }}
                            className={`h-full ${task.isCompleted ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-indigo-500 shadow-sm shadow-indigo-500'} rounded-full`}
                          />
                        </View>

                        <View className="flex-row justify-between items-center pt-4 border-t border-white/5">
                          {task.dueDate ? (
                            <View className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-xl">
                              <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
                              <Text className="text-slate-400 text-[10px] ml-2 font-bold uppercase">
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row items-center opacity-30">
                              <Ionicons name="time-outline" size={12} color="#94a3b8" />
                              <Text className="text-slate-400 text-[10px] ml-2 font-bold uppercase">Infinite time</Text>
                            </View>
                          )}

                          <View className="flex-row items-center">
                            <TouchableOpacity
                              className="flex-row items-center mr-5"
                              onPress={() => router.push({ pathname: "/(pages)/study/[id]", params: { id: task._id, title: task.title } })}
                            >
                              <View className="w-8 h-8 bg-indigo-500/10 rounded-full items-center justify-center mr-2">
                                <Ionicons name="book-outline" size={14} color="#818cf8" />
                              </View>
                              <Text className="text-indigo-400 text-xs font-bold">STUDY</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              className="flex-row items-center"
                              onPress={() => router.push({ pathname: "/(pages)/roadmap/[id]", params: { id: task._id } })}
                            >
                              <View className="w-8 h-8 bg-indigo-500/10 rounded-full items-center justify-center mr-2">
                                <Ionicons name="navigate-outline" size={14} color="#818cf8" />
                              </View>
                              <Text className="text-indigo-400 text-xs font-bold">ROUTEMAP</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </PremiumBackground>
  );
}
