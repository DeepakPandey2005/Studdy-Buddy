import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch, RootState } from "@/app/store";
import { markStepDoneAsync } from "@/app/store/tasksSlice";
import { Config } from "@/constants/Config";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function MCQPage() {
  /* -------------------- STATE -------------------- */
  const { stepId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.list);

  // 🔎 find step from redux
  const step = useMemo(() => {
    return tasks
      .flatMap(task => task.steps)
      .find(s => s._id === stepId);
  }, [tasks, stepId]);

  const [mcqs, setMcqs] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Mounted ref to prevent state updates/navigation on unmounted component
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* -------------------- FETCH MCQS -------------------- */
  useEffect(() => {
    if (!step) return;

    const fetchMCQs = async () => {
      try {
        const res = await axios.post(`${Config.API_URL}/api/generate/ai/mcq`, {
          stepId,
          title: step.title,
        });
        if (isMounted.current) {
          setMcqs(res.data.mcqs || []);
        }
      } catch (err) {
        console.log("MCQ FETCH ERROR:", err);
        if (isMounted.current) {
          Alert.alert("Error", "Failed to load questions. Please try again.");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchMCQs();
  }, [stepId, step]);

  /* -------------------- HANDLERS -------------------- */
  const handleAnswer = (option: string) => {
    if (selectedOption !== null) return; // Prevent double clicking

    setSelectedOption(option);
    const correct = mcqs[current].answer;
    const isCorrect = option.trim().toLowerCase() === correct.trim().toLowerCase();

    // Optimistic score update for UI
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Wait a bit before moving to next question
    setTimeout(() => {
      if (!isMounted.current) return;

      if (current === mcqs.length - 1) {
        // Pass the calculated final score logic
        // Use 'score' (current render value) + 1 if correct for the FINAL total
        // Note: 'score' here is the state BEFORE the setScore(prev => prev+1) above has necessarily flushed?
        // Actually, inside the timeout closures, 'score' refers to the render scope where handleAnswer was defined.
        // So yes: if isCorrect, add 1.
        finishQuiz(isCorrect ? score + 1 : score);
      } else {
        setCurrent(prev => prev + 1);
        setSelectedOption(null);
      }
    }, 1500);
  };

  const finishQuiz = (finalScore: number) => {
    if (!isMounted.current) return;
    setIsDone(true);

    // Completion threshold: 4 out of 5
    if (finalScore >= 4) {
      // Mark done in DB
      dispatch(markStepDoneAsync(stepId as string));

      Alert.alert("🎉 Success!", `You scored ${finalScore}/5! Step completed.`, [
        {
          text: "Awesome",
          onPress: () => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)/Tasks');
          }
        }
      ]);
    } else {
      Alert.alert("Result", `You got ${finalScore}/5 correct. You need at least 4/5 to complete this step. Review and try again!`, [
        {
          text: "Try Again", onPress: () => {
            if (!isMounted.current) return;
            setCurrent(0);
            setScore(0);
            setSelectedOption(null);
            setIsDone(false);
          }
        },
        {
          text: "Go Back",
          onPress: () => {
            if (router.canGoBack()) router.back();
          }
        }
      ]);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-white mt-4 font-medium">Preparing your Quiz...</Text>
      </View>
    );
  }

  if (!step || mcqs.length === 0) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center p-6">
        <Text className="text-white text-center">No questions found for this step.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-indigo-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = mcqs[current];
  const progress = ((current + 1) / mcqs.length) * 100;

  return (
    <View className="flex-1 bg-gray-950 px-6 pt-12">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-indigo-400 font-bold text-lg">Quiz Master</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
        <View
          style={{ width: `${progress}%` }}
          className="h-full bg-indigo-500 rounded-full"
        />
      </View>

      <Text className="text-gray-400 font-medium mb-1">
        Question {current + 1} of {mcqs.length}
      </Text>
      <Text className="text-white text-2xl font-bold mb-8">
        {q.question}
      </Text>

      {/* Options */}
      <View className="space-y-4">
        {q.options.map((opt: string, index: number) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt.trim().toLowerCase() === q.answer.trim().toLowerCase();

          let bgColor = "bg-gray-900";
          let borderColor = "border-gray-800";

          if (selectedOption !== null) {
            if (isCorrect) {
              bgColor = "bg-green-500/20";
              borderColor = "border-green-500";
            } else if (isSelected) {
              bgColor = "bg-red-500/20";
              borderColor = "border-red-500";
            }
          } else {
            // Hover-like state is not available purely in RN styles without extra state, but we'll use a clean interaction
          }

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => handleAnswer(opt)}
              className={`${bgColor} ${borderColor} border-2 p-5 rounded-2xl flex-row items-center justify-between mb-4`}
              disabled={selectedOption !== null}
            >
              <Text className={`flex-1 text-lg ${selectedOption !== null && isCorrect ? 'text-green-400 font-semibold' : 'text-gray-200'}`}>
                {opt}
              </Text>

              {selectedOption !== null && (
                isCorrect ? (
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                ) : isSelected ? (
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                ) : null
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer / Stats */}
      <View className="mt-auto mb-10 items-center">
        <View className="bg-gray-900/50 px-6 py-3 rounded-full flex-row items-center">
          <Text className="text-gray-400 mr-2">Current Score:</Text>
          <Text className="text-indigo-400 font-bold text-xl">{score}</Text>
        </View>
      </View>
    </View>
  );
}
