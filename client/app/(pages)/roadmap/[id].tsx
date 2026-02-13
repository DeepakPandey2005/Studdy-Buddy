import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchTasks } from "@/app/store/tasksSlice";

export default function Roadmap() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.list) as any[];

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length]);

  // use task from redux store instead of fetching manually
  useEffect(() => {
    if (!id) return;
    const selected = tasks.find((t: any) => t._id === id);
    if (selected) {
      setTask(selected);
      setLoading(false);
    } else if (tasks.length > 0) {
      setLoading(false);
    }
  }, [id, tasks]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="gray" />
        <Text className="text-gray-400 mt-4">Task not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-indigo-400">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const completedSteps = task.steps ? task.steps.filter((s: any) => s.isDone).length : 0;
  const totalSteps = task.steps ? task.steps.length : 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1 px-6 pt-8">
        {/* HEADER */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-gray-900 p-2 rounded-full border border-gray-800">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold" numberOfLines={1}>
              {task.title}
            </Text>
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">Roadmap</Text>
          </View>
        </View>

        {/* PROGRESS BAR */}
        <View className="mb-10 bg-gray-900/50 p-5 rounded-3xl border border-gray-800">
          <View className="flex-row justify-between mb-3 items-end">
            <View>
              <Text className="text-gray-400 text-xs uppercase font-bold">Progress</Text>
              <Text className="text-white text-3xl font-bold">{progress}%</Text>
            </View>
            <View className="items-end">
              <Text className="text-indigo-400 text-base font-bold">{completedSteps}/{totalSteps}</Text>
              <Text className="text-gray-500 text-xs">Steps Competed</Text>
            </View>
          </View>

          <View className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* ROADMAP STEPS */}
        <Text className="text-white text-lg font-bold mb-6">Your Journey</Text>

        <View className="pb-20">
          {task.steps && task.steps.map((step: any, index: number) => {
            const isDone = step.isDone;
            // Current if not done AND (it's the first one OR the previous one is done)
            const isCurrent = !isDone && (index === 0 || task.steps[index - 1]?.isDone);
            const isLocked = !isDone && !isCurrent;

            return (
              <View key={index} className="flex-row mb-0 relative">
                {/* TIMELINE LINE */}
                {index !== totalSteps - 1 && (
                  <View className="absolute left-[19px] top-10 bottom-[-30px] w-[2px] bg-gray-800 z-0" />
                )}

                {/* INDICATOR */}
                <View className="mr-6 z-10 items-center">
                  <View className={`w-10 h-10 rounded-full items-center justify-center border-4 ${isDone
                    ? 'bg-green-500 border-gray-950'
                    : isCurrent
                      ? 'bg-gray-950 border-indigo-500'
                      : 'bg-gray-900 border-gray-800'
                    }`}>
                    {isDone ? (
                      <Ionicons name="checkmark" size={18} color="white" />
                    ) : isCurrent ? (
                      <View className="w-3 h-3 bg-indigo-500 rounded-full" />
                    ) : (
                      <Ionicons name="lock-closed" size={14} color="#6b7280" />
                    )}
                  </View>
                </View>

                {/* STEP CARD */}
                <TouchableOpacity
                  activeOpacity={isLocked ? 1 : 0.7}
                  onPress={() => {
                    if (!isLocked) {
                      router.push(`/roadmap/step/${step._id}`)
                    }
                  }}
                  className={`flex-1 mb-6 rounded-2xl border p-4 ${isDone
                    ? "bg-green-500/10 border-green-500/20"
                    : isCurrent
                      ? "bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/10"
                      : "bg-gray-900 border-gray-800 opacity-60"
                    }`}
                >
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className={`font-bold text-sm uppercase tracking-wide ${isDone ? 'text-green-400' : isCurrent ? 'text-indigo-400' : 'text-gray-500'
                      }`}>
                      Step {index + 1}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={isLocked ? "#4b5563" : "#9ca3af"} />
                  </View>

                  <Text className={`text-base font-bold mb-1 ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                    {step.title}
                  </Text>

                  {isCurrent && (
                    <Text className="text-indigo-400 text-xs mt-2 font-medium">
                      Tap to start learning →
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
