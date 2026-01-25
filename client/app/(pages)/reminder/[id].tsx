import { getToken } from "@/app/utils/token";
import { Config } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

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
  const { id } = useLocalSearchParams();

  const [task, setTask] = useState<any>(null);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // 📥 Fetch task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${Config.API_URL}/api/tasks/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const selected = res.data.find((t: any) => t._id === id);
        setTask(selected);
      } catch (err) {
        console.log("TASK FETCH ERROR:", err);
      }
    };

    fetchTask();
  }, [id]);

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
      alert("Notification permission required");
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
        title: "📚 Study Buddy Reminder",
        body: `Time to work on: ${task.title}`,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: scheduledTime,
      },
    });

    alert(`Reminder set for ${scheduledTime.toLocaleString()} ⏰`);
  };

  if (!task) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-white">Loading task...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 px-5 pt-6">
      {/* HEADER */}
      <Text className="text-white text-3xl font-bold mb-2">
        Set Reminder ⏰
      </Text>
      <Text className="text-gray-400 mb-6">{task.title}</Text>

      {/* TIME CARD */}
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        className="bg-gray-800 rounded-3xl p-6 items-center mb-8"
      >
        <Ionicons name="time-outline" size={42} color="#60A5FA" />
        <Text className="text-white text-3xl font-bold mt-3">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text className="text-gray-400">Daily Reminder</Text>
      </TouchableOpacity>

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
        className="bg-green-500 py-4 rounded-2xl mt-auto"
      >
        <Text className="text-white text-center font-semibold text-lg">
          Set Reminder
        </Text>
      </TouchableOpacity>
    </View>
  );
}
