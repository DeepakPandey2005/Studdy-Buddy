import { Config } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Redirect } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getToken } from "../utils/token";

export default function CreateTask() {
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

      Alert.alert("Success", "Task created successfully");

      <Redirect href="/Tasks" />;

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
    <ScrollView className="flex-1 bg-gray-900 px-5 pt-6">
      {/* HEADER */}
      <Text className="text-white text-3xl font-bold mb-2">Create Task 📝</Text>
      <Text className="text-gray-400 mb-6">
        Add a new task to stay consistent
      </Text>

      {/* TITLE */}
      <Text className="text-gray-300 mb-2">Title</Text>
      <View className="bg-gray-800 rounded-xl px-4 py-3 mb-5 flex-row items-center">
        <Ionicons name="clipboard-outline" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Eg. Revise React Native"
          placeholderTextColor="#9CA3AF"
          className="text-white ml-3 flex-1"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* DESCRIPTION */}
      <Text className="text-gray-300 mb-2">Description</Text>
      <View className="bg-gray-800 rounded-xl px-4 py-3 mb-5">
        <TextInput
          placeholder="What exactly will you do?"
          placeholderTextColor="#9CA3AF"
          className="text-white"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* DUE DATE */}
      <Text className="text-gray-300 mb-2">Due Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="bg-gray-800 rounded-xl px-4 py-4 mb-8 flex-row items-center"
      >
        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
        <Text className="text-white ml-3">
          {dueDate ? dueDate.toDateString() : "Select due date"}
        </Text>
      </TouchableOpacity>

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
        className={`py-4 rounded-2xl ${
          loading ? "bg-blue-400" : "bg-blue-500"
        }`}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? "Creating..." : "Create Task"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
