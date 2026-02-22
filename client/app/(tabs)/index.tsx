import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, getUser } from '../utils/token'; // Added getUser import
import { fetchTasks } from '../store/tasksSlice';
import { AppDispatch, RootState } from '../store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PremiumBackground } from '../components/PremiumBackground';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [username, setUsername] = useState('Friend');

  const { list: tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks) as { list: any[], loading: boolean };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        setIsAuth(false);
      } else {
        const u = await getUser();
        if (u) setUsername(u);
        setIsAuth(true);
        dispatch(fetchTasks());
      }
    };
    checkAuth();
  }, [dispatch]);

  const stats = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return {
        completedSteps: 0,
        totalSteps: 0,
        progress: 0,
        tasksCompleted: 0,
        activeTasks: 0,
        streak: 0
      };
    }

    let totalSteps = 0;
    let completedSteps = 0;
    let tasksCompleted = 0;

    tasks.forEach((t: any) => {
      if (t.isCompleted) tasksCompleted++;
      if (t.steps) {
        totalSteps += t.steps.length;
        completedSteps += t.steps.filter((s: any) => s.isDone).length;
      }
    });

    const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return {
      progress,
      completedSteps,
      totalSteps,
      tasksCompleted,
      activeTasks: tasks.length - tasksCompleted,
      streak: 5 // Mock streak for now or calculate if date data exists
    };
  }, [tasks]);

  if (isAuth === null) {
    return (
      <View className="flex-1 bg-gray-950 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (isAuth === false) {
    return <Redirect href="/(auth)/login" />;
  }

  // Find ongoing task (first incomplete task)
  const ongoingTask = tasks.find((t: any) => !t.isCompleted);

  return (
    <PremiumBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* HEADER */}
          <View className="flex-row justify-between items-center px-6 pt-4 mb-8">
            <View>
              <Text className="text-gray-400 text-sm font-medium mb-1">Welcome back,</Text>
              <Text className="text-white text-2xl font-bold">{username} 👋</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/Explore')}
              className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 items-center justify-center"
            >
              <Text className="text-indigo-400 font-bold text-lg">{username[0]?.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          {/* STATS CARDS */}
          <View className="flex-row px-6 mb-8 justify-between">
            <View className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex-1 mr-3 relative overflow-hidden backdrop-blur-md">
              <View className="absolute top-0 right-0 p-3 opacity-[0.03]">
                <Ionicons name="flame" size={80} color="#f59e0b" />
              </View>
              <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-3">Streak</Text>
              <View className="flex-row items-baseline">
                <Text className="text-white text-3xl font-black mr-1">{stats.streak}</Text>
                <Text className="text-amber-500/80 font-bold text-xs">DAYS 🔥</Text>
              </View>
            </View>

            <View className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex-1 ml-3 relative overflow-hidden backdrop-blur-md">
              <View className="absolute top-0 right-0 p-3 opacity-[0.03]">
                <Ionicons name="checkmark-circle" size={80} color="#10b981" />
              </View>
              <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-3">Mastery</Text>
              <View className="flex-row items-baseline">
                <Text className="text-white text-3xl font-black mr-1">{stats.completedSteps}</Text>
                <Text className="text-emerald-500/80 font-bold text-xs">/ {stats.totalSteps}</Text>
              </View>
            </View>
          </View>

          {/* MAIN PROGRESS CARD */}
          <View className="mx-6 mb-10">
            <View className="bg-white/5 border border-indigo-500/20 rounded-[40px] p-8 relative overflow-hidden">
              {/* Background Glow */}
              <View className="absolute top-0 left-0 w-full h-full bg-indigo-500/5 opacity-50" />

              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className="text-white text-xl font-black tracking-tight">Focus Score</Text>
                  <Text className="text-indigo-300/50 text-[10px] font-bold uppercase tracking-wider">Your weekly evolution</Text>
                </View>
                <View className="bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20">
                  <Text className="text-indigo-400 font-black text-xs">{tasks.length} ACTIVE</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="relative items-center justify-center">
                  <Svg width={140} height={140} className="rotate-[-90deg]">
                    <Defs>
                      <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#818cf8" stopOpacity="1" />
                        <Stop offset="1" stopColor="#c084fc" stopOpacity="1" />
                      </LinearGradient>
                    </Defs>
                    <Circle cx="70" cy="70" r="60" stroke="rgba(255,255,255,0.03)" strokeWidth="14" fill="transparent" />
                    <Circle
                      cx="70"
                      cy="70"
                      r="60"
                      stroke="url(#grad)"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * stats.progress) / 100}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View className="absolute items-center justify-center">
                    <Text className="text-white text-4xl font-black">{stats.progress}%</Text>
                  </View>
                </View>

                <View className="flex-1 ml-10">
                  <View className="mb-6">
                    <Text className="text-indigo-300/40 text-[9px] font-black uppercase tracking-[2px] mb-1">Success Rate</Text>
                    <Text className="text-white text-2xl font-black">{stats.tasksCompleted}</Text>
                  </View>
                  <View>
                    <Text className="text-indigo-300/40 text-[9px] font-black uppercase tracking-[2px] mb-1">In Pipeline</Text>
                    <Text className="text-white text-2xl font-black">{stats.activeTasks}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ONGOING TASK */}
          <View className="px-6 mb-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">Continue Learning</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/Tasks')}>
                <Text className="text-indigo-400 text-sm font-semibold">View All</Text>
              </TouchableOpacity>
            </View>

            {ongoingTask ? (
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/(pages)/roadmap/[id]", params: { id: ongoingTask._id } })}
                activeOpacity={0.8}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-5 flex-row items-center shadow-lg"
              >
                <View className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 items-center justify-center mr-4">
                  <Ionicons name="play" size={24} color="#818cf8" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>{ongoingTask.title}</Text>
                  <View className="h-1.5 bg-gray-800 rounded-full w-full overflow-hidden mt-2">
                    <View style={{ width: '40%' }} className="h-full bg-indigo-500 rounded-full" />
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#4b5563" className="ml-2" />
              </TouchableOpacity>
            ) : (
              <View className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 items-center justify-center border-dashed">
                <Text className="text-gray-500 mb-4">No active tasks</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(pages)/createTask')}
                  className="bg-indigo-600 px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-bold">Start New Goal +</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </PremiumBackground>
  );
}
