import { AppDispatch, RootState } from "@/app/store";
import { fetchTasks } from "@/app/store/tasksSlice";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

// 🔔 Notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Reminder() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [task, setTask] = useState<any>(null);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const tasks = useSelector((state: RootState) => state.tasks.list) as any[];

  // use task from redux store instead of fetching manually
  useEffect(() => {
    if (!id) return;
    const selected = tasks.find((t: any) => t._id === id);
    if (selected) setTask(selected);
  }, [id, tasks]);

  // ⏰ Time picker handler
  const onTimeChange = (_: any, selectedTime?: Date) => {
    setShowPicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  // 🔔 Schedule notification (ANDROID COMPATIBLE)
  const setReminder = async () => {
    if (!task) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission", "Notification permission is required to set reminders.");
      return;
    }

    // Calculate the next occurrence of the selected time
    const scheduledTime = new Date();
    scheduledTime.setHours(time.getHours());
    scheduledTime.setMinutes(time.getMinutes());
    scheduledTime.setSeconds(0);
    scheduledTime.setMilliseconds(0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    // Schedule notification using DATE trigger (Android compatible)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Study Reminder 🔔",
        body: `It's time to work on: ${task.title}`,
        sound: "default",
        data: { taskId: task._id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledTime,
      },
    });

    Alert.alert(
      "Reminder Set",
      `We'll remind you at ${scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  if (!task) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <Text className="text-white">Loading task...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="flex-1 px-6 pt-8">

        {/* HEADER */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-gray-900 p-2 rounded-full border border-gray-800">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">Set Reminder ⏰</Text>
            <Text className="text-gray-400 text-sm font-medium" numberOfLines={1}>{task.title}</Text>
          </View>
        </View>

        {/* TIME CARD */}
        <View className="items-center justify-center py-10">
          <View className="w-64 h-64 rounded-full bg-gray-900 border-4 border-gray-800 items-center justify-center shadow-2xl shadow-black/50">
            <View className="absolute top-0 bottom-0 w-1 bg-gray-800" />
            <View className="absolute left-0 right-0 h-1 bg-gray-800" />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="bg-gray-950 w-56 h-56 rounded-full items-center justify-center border border-gray-800"
            >
              <Text className="text-indigo-400 text-5xl font-bold tracking-wider">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
              </Text>
              <Text className="text-gray-500 text-sm mt-2 uppercase tracking-widest">
                Daily
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-gray-400 text-center mb-10 px-10">
          Tap the circle above to change the reminder time. We'll notify you effectively.
        </Text>

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === "android" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}

        {/* SET BUTTON */}
        <TouchableOpacity
          onPress={setReminder}
          activeOpacity={0.8}
          className="bg-indigo-600 py-4 rounded-full shadow-lg shadow-indigo-500/30 mt-auto mb-10"
        >
          <Text className="text-white text-center font-bold text-lg">
            Confirm Reminder
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
