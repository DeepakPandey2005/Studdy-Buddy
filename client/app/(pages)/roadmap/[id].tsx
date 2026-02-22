import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchTasks } from "@/app/store/tasksSlice";
import { PremiumBackground } from "@/app/components/PremiumBackground";

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
      <PremiumBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </PremiumBackground>
    );
  }

  if (!task) {
    return (
      <PremiumBackground>
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={48} color="gray" />
          <Text className="text-gray-400 mt-4">Task not found</Text>
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-indigo-400">Go Back</Text>
          </TouchableOpacity>
        </View>
      </PremiumBackground>
    );
  }

  const completedSteps = task.steps ? task.steps.filter((s: any) => s.isDone).length : 0;
  const totalSteps = task.steps ? task.steps.length : 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <PremiumBackground>
      <SafeAreaView className="flex-1">
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
          <View className="mb-10 bg-white/5 p-6 rounded-[32px] border border-white/10 relative overflow-hidden">
            <View className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16" />

            <View className="flex-row justify-between mb-4 items-end">
              <View>
                <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px]">Efficiency</Text>
                <Text className="text-white text-4xl font-black">{progress}%</Text>
              </View>
              <View className="items-end">
                <Text className="text-indigo-400 text-lg font-black">{completedSteps}/{totalSteps}</Text>
                <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Milestones</Text>
              </View>
            </View>

            <View className="h-2 bg-white/5 rounded-full overflow-hidden">
              <View
                className="h-full bg-indigo-500 rounded-full shadow-lg shadow-indigo-500"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          {/* ROADMAP STEPS */}
          <Text className="text-white text-xl font-black mb-6 tracking-tight">Your Evolution</Text>

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
                    <View className="absolute left-[24px] top-12 bottom-[-20px] w-[1px] bg-white/5 z-0" />
                  )}

                  {/* INDICATOR */}
                  <View className="mr-6 z-10 items-center">
                    <View className={`w-12 h-12 rounded-full items-center justify-center border-2 ${isDone
                      ? 'bg-emerald-500/20 border-emerald-500'
                      : isCurrent
                        ? 'bg-indigo-500 border-white/5'
                        : 'bg-white/5 border-white/10'
                      }`}>
                      {isDone ? (
                        <Ionicons name="checkmark" size={20} color="#10b981" />
                      ) : isCurrent ? (
                        <Ionicons name="rocket" size={20} color="white" />
                      ) : (
                        <Ionicons name="lock-closed" size={16} color="#4b5563" />
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
                    className={`flex-1 mb-8 rounded-[28px] border p-6 ${isDone
                      ? "bg-emerald-500/5 border-emerald-500/10"
                      : isCurrent
                        ? "bg-white/5 border-indigo-500/30 shadow-2xl shadow-indigo-500/10"
                        : "bg-white/5 border-white/5 opacity-40"
                      }`}
                  >
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className={`font-black text-[10px] uppercase tracking-[2px] ${isDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-400' : 'text-gray-500'
                        }`}>
                        PHASE {index + 1}
                      </Text>
                      {!isLocked && <Ionicons name="chevron-forward" size={16} color={isDone ? "#10b981" : "#818cf8"} />}
                    </View>

                    <Text className={`text-lg font-bold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                      {step.title}
                    </Text>

                    {isCurrent && (
                      <View className="flex-row items-center mt-3">
                        <View className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse mr-2" />
                        <Text className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                          Initialize Training →
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PremiumBackground>
  );
}
