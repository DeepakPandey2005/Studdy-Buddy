import { Config } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getToken } from "../utils/token";

export default function CreateTask() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();

      await axios.post(
        `${Config.API_URL}/api/tasks/create`,
        {
          title,
          description,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert("Success", "Task created successfully", [
        { text: "OK", onPress: () => router.push('/(tabs)/Tasks') }
      ]);

      // reset form
      setTitle("");
      setDescription("");
      setDueDate(null);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to create task",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView
        className="flex-1 px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-gray-900 p-2 rounded-full border border-gray-800">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-2xl font-bold">New Goal 🎯</Text>
            <Text className="text-gray-400 text-sm">Set your targets high</Text>
          </View>
        </View>

        {/* TITLE */}
        <View className="mb-6">
          <Text className="text-gray-400 mb-2 font-medium ml-1">Task Title</Text>
          <View className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-4 flex-row items-center focus:border-indigo-500">
            <Ionicons name="flag-outline" size={22} color="#6366f1" />
            <TextInput
              placeholder="E.g., Master Redux Toolkit"
              placeholderTextColor="#64748b"
              className="text-white ml-3 flex-1 text-base"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* DESCRIPTION */}
        <View className="mb-6">
          <Text className="text-gray-400 mb-2 font-medium ml-1">Description</Text>
          <View className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 align-top h-24">
            <TextInput
              placeholder="Add details about your task..."
              placeholderTextColor="#64748b"
              className="text-white text-base h-full"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* DUE DATE */}
        <View className="mb-10">
          <Text className="text-gray-400 mb-2 font-medium ml-1">Deadline</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
            className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={22} color="#a855f7" />
              <Text className={`ml-3 text-base ${dueDate ? 'text-white' : 'text-gray-500'}`}>
                {dueDate ? dueDate.toDateString() : "Select a date"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* DATE PICKER */}
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setDueDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />

        {/* CREATE BUTTON */}
        <TouchableOpacity
          onPress={handleCreateTask}
          disabled={loading}
          activeOpacity={0.8}
          className={`py-4 rounded-full shadow-lg shadow-indigo-500/20 mb-10 ${loading ? "bg-indigo-800" : "bg-indigo-600"
            }`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {loading ? "Creating..." : "Create Task"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
