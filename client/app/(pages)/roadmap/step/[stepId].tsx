import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AppDispatch, RootState } from "@/app/store";
import { markStepDone } from "@/app/store/tasksSlice";
import { Config } from "@/constants/Config";

export default function MCQPage() {
  const { stepId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector((state: RootState) => state.tasks.list);

  // 🔎 find step from redux
  const step = tasks
    .flatMap(task => task.steps)
    .find(s => s._id === stepId);

  const [mcqs, setMcqs] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!step) return;

    axios
      .post(`${Config.API_URL}/api/generate/ai/mcq`, {
        stepId,
        title: step.title,
      })
      .then(res => {
        setMcqs(res.data.mcqs);
        setLoading(false);
      })
      .catch(err => {
        console.log("MCQ FETCH ERROR:", err);
        setLoading(false);
      });
  }, [stepId]);

  const handleAnswer = (option: string) => {
    const correct = mcqs[current].answer;

    let newScore = score;
    if (option === correct) {
      newScore += 1;
      setScore(newScore);
    }

    // last question
    if (current === mcqs.length - 1) {
      if (newScore >= 3) {
        dispatch(markStepDone(stepId as string));
      }
      router.back();
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  if (loading || !step) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <Text className="text-white">Loading MCQs...</Text>
      </View>
    );
  }

  const q = mcqs[current];


  return (
    <View className="flex-1 bg-gray-900 px-5 pt-8">
      <Text className="text-white text-xl font-bold mb-2">
        {step.title}
      </Text>

      <Text className="text-gray-400 mb-6">
        Question {current + 1} / {mcqs.length}
      </Text>

      <View className="bg-gray-800 rounded-2xl p-5 mb-6">
        <Text className="text-white text-lg">
          {q.question}
        </Text>
      </View>

      {q.options.map((opt: string, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleAnswer(opt)}
          className="bg-gray-700 py-4 px-4 rounded-xl mb-3"
        >
          <Text className="text-white">{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
