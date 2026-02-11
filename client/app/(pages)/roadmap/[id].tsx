import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import {  useSelector } from "react-redux";
import {  RootState } from "@/app/store";

export default function Roadmap() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const tasks = useSelector((state: RootState) => state.tasks.list) as any[];

 
  // use task from redux store instead of fetching manually
  useEffect(() => {
    if (!id) return;
    const selected = tasks.find((t: any) => t._id === id);
    if (selected) setTask(selected);
    setLoading(false);
  }, [id, tasks]);



  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!task) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-white">Task not found</Text>
      </View>
    );
  }

  const completedSteps = task.steps.filter((s: any) => s.isDone).length;
  const progress = Math.round((completedSteps / task.steps.length) * 100);

  return (
    <ScrollView className="flex-1 bg-gray-900 px-5 pt-6">
      {/* HEADER */}
      <Text className="text-white text-3xl font-bold mb-1">
        {task.title} 🧭
      </Text>
      <Text className="text-gray-400 mb-6">
        Follow your roadmap step by step
      </Text>

      {/* PROGRESS BAR */}
      <View className="mb-8">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-300">Progress</Text>
          <Text className="text-white font-semibold">{progress}%</Text>
        </View>

        <View className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* ROADMAP STEPS */}
      {task.steps.map((step: any, index: number) => {
        const isCurrent = !step.isDone && task.steps[index - 1]?.isDone;

        return (
          <View key={index} className="flex-row mb-6">
            {/* TIMELINE */}
            <View className="items-center mr-4">
              <Ionicons
                name={
                  step.isDone
                    ? "checkmark-circle"
                    : isCurrent
                      ? "radio-button-on"
                      : "lock-closed"
                }
                size={26}
                color={
                  step.isDone ? "#22C55E" : isCurrent ? "#3B82F6" : "#6B7280"
                }
              />
              {index !== task.steps.length - 1 && (
                <View className="w-[2px] flex-1 bg-gray-700 mt-1" />
              )}
            </View>

            {/* STEP CARD */}
            <View
              className={`flex-1 rounded-2xl p-4 ${
                step.isDone
                  ? "bg-green-500/10"
                  : isCurrent
                    ? "bg-blue-500/10"
                    : "bg-gray-800"
              }`}
            >
              <Pressable onPress={() => router.push(`/roadmap/step/${step._id}`)}>
                <Text className="text-white font-semibold text-lg">
                  Step {index + 1}
                </Text>
                <Text className="text-gray-400 mt-1">{step.title}</Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
