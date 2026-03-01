import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, getUser } from '../utils/token';
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
      streak: 7 // Mock streak
    };
  }, [tasks]);

  if (isAuth === null) {
    return (
      <View className="flex-1 bg-[#050510] items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (isAuth === false) {
    return <Redirect href="/(auth)/login" />;
  }

  const ongoingTask = tasks.find((t: any) => !t.isCompleted);

  return (
    <PremiumBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* TOP BAR / NAVIGATION */}
          <View className="flex-row justify-between items-center px-6 pt-6 mb-8">
            <View>
              <Text className="text-indigo-400 text-xs font-black uppercase tracking-[3px] mb-1">DASHBOARD</Text>
              <Text className="text-white text-3xl font-black">Hey {username}!</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/Explore')}
              activeOpacity={0.7}
              className="w-14 h-14 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center overflow-hidden"
            >
              <View className="absolute inset-0 bg-indigo-500/10" />
              <Text className="text-indigo-400 font-black text-xl">{username[0]?.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>

          {/* QUICKS ACTIONS / SEARCH STYLE BUTTON */}
          <View className="px-6 mb-8">
            <Pressable
              onPress={() => router.push('/(tabs)/Explore')}
              className="bg-white/5 border border-white/10 rounded-[28px] py-4 px-6 flex-row items-center"
            >
              <Ionicons name="search" size={20} color="#6366f1" />
              <Text className="text-gray-400 ml-3 text-base font-medium">Search for topics, tasks, AI...</Text>
            </Pressable>
          </View>

          {/* KPI CARDS GRID */}
          <View className="flex-row px-6 mb-8 justify-between">
            <View className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-[32px] w-[48%] overflow-hidden">
              <View className="absolute -top-4 -right-4">
                <Ionicons name="flame" size={80} color="#6366f1" opacity={0.1} />
              </View>
              <Text className="text-indigo-300/60 text-[10px] font-black uppercase tracking-[1px] mb-2">STREAK</Text>
              <View className="flex-row items-end">
                <Text className="text-white text-3xl font-black">{stats.streak}</Text>
                <Text className="text-indigo-400 font-bold text-[10px] ml-1 mb-1.5">DAYS</Text>
              </View>
            </View>

            <View className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-[32px] w-[48%] overflow-hidden">
              <View className="absolute -top-4 -right-4">
                <Ionicons name="trophy" size={80} color="#10b981" opacity={0.1} />
              </View>
              <Text className="text-emerald-300/60 text-[10px] font-black uppercase tracking-[1px] mb-2">MASTERY</Text>
              <View className="flex-row items-end">
                <Text className="text-white text-3xl font-black">{stats.completedSteps}</Text>
                <Text className="text-emerald-400 font-bold text-[10px] ml-1 mb-1.5">STEPS</Text>
              </View>
            </View>
          </View>

          {/* CENTRAL PROGRESS HUB */}
          <View className="mx-6 mb-10">
            <View className="bg-gray-900/40 border border-white/5 rounded-[48px] p-8 overflow-hidden">
              <View className="flex-row justify-between items-center mb-10">
                <View>
                  <Text className="text-white text-xl font-black tracking-tight">Active Learning</Text>
                  <Text className="text-indigo-400/50 text-[10px] font-black uppercase tracking-[2px]">Core Momentum</Text>
                </View>
                <View className="bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-500/30">
                  <Text className="text-indigo-300 font-black text-[10px]">{tasks.length} COURSES</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="relative items-center justify-center">
                  <Svg width={150} height={150} className="rotate-[-90deg]">
                    <Defs>
                      <LinearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#818cf8" />
                        <Stop offset="1" stopColor="#c084fc" />
                      </LinearGradient>
                    </Defs>
                    <Circle cx="75" cy="75" r="65" stroke="rgba(255,255,255,0.02)" strokeWidth="15" fill="transparent" />
                    <Circle
                      cx="75"
                      cy="75"
                      r="65"
                      stroke="url(#grad2)"
                      strokeWidth="15"
                      fill="transparent"
                      strokeDasharray={408}
                      strokeDashoffset={408 - (408 * stats.progress) / 100}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <View className="absolute items-center justify-center">
                    <Text className="text-white text-4xl font-black">{stats.progress}%</Text>
                    <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest mt-1">Overall</Text>
                  </View>
                </View>

                <View className="flex-1 ml-10 space-y-6">
                  <View>
                    <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[1px] mb-1">Completed</Text>
                    <View className="flex-row items-center">
                      <Text className="text-white text-2xl font-black mr-2">{stats.tasksCompleted}</Text>
                      <Ionicons name="checkmark-done" size={16} color="#c084fc" />
                    </View>
                  </View>
                  <View className="mt-4">
                    <Text className="text-gray-500 text-[10px] font-black uppercase tracking-[1px] mb-1">In Pipeline</Text>
                    <View className="flex-row items-center">
                      <Text className="text-white text-2xl font-black mr-2">{stats.activeTasks}</Text>
                      <Ionicons name="timer-outline" size={16} color="#818cf8" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ONGOING TASK - REDESIGNED */}
          <View className="px-6 mb-10">
            <View className="flex-row justify-between items-end mb-6">
              <View>
                <Text className="text-white text-2xl font-black mb-1">Continue</Text>
                <Text className="text-indigo-400/50 text-xs font-bold">Pick up where you left off</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/Tasks')}>
                <Text className="text-indigo-400 text-sm font-black uppercase tracking-widest">Explore All</Text>
              </TouchableOpacity>
            </View>

            {ongoingTask ? (
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/(pages)/roadmap/[id]", params: { id: ongoingTask._id } })}
                activeOpacity={0.8}
                className="bg-[#10101a] border border-white/5 rounded-[40px] p-6 shadow-2xl relative overflow-hidden"
              >
                <View className="absolute -right-10 -bottom-10 opacity-[0.05]">
                  <Ionicons name="rocket" size={200} color="#6366f1" />
                </View>

                <View className="flex-row items-center mb-6">
                  <View className="w-14 h-14 rounded-2xl bg-indigo-500 items-center justify-center mr-4 shadow-lg shadow-indigo-500/50" style={{ elevation: 10 }}>
                    <Ionicons name="flash" size={28} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-black mb-1" numberOfLines={1}>{ongoingTask.title}</Text>
                    <Text className="text-indigo-300/50 text-xs font-bold uppercase tracking-widest">Next Milestone Pending</Text>
                  </View>
                </View>

                <View className="bg-white/5 rounded-2xl p-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">Current Progress</Text>
                    <Text className="text-indigo-400 text-[10px] font-black">40%</Text>
                  </View>
                  <View className="h-2 bg-gray-800 rounded-full w-full overflow-hidden">
                    <View style={{ width: '40%' }} className="h-full bg-indigo-500 rounded-full" />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <Pressable
                onPress={() => router.push('/(pages)/createTask')}
                className="bg-gray-900/30 border border-indigo-500/20 border-dashed rounded-[40px] p-10 items-center justify-center"
              >
                <View className="w-16 h-16 bg-indigo-500/10 rounded-full items-center justify-center mb-4">
                  <Ionicons name="add" size={32} color="#6366f1" />
                </View>
                <Text className="text-gray-500 font-bold mb-6">Your roadmap is wide open</Text>
                <View className="bg-indigo-600 px-8 py-4 rounded-3xl shadow-lg shadow-indigo-600/30">
                  <Text className="text-white font-black">START NEW JOURNEY</Text>
                </View>
              </Pressable>
            )}
          </View>

          {/* AI ASSISTANT TEASER */}
          <View className="mx-6 p-1 rounded-[40px] bg-indigo-600/10">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/Assistant')}
              className="bg-[#121225] rounded-[38px] p-6 flex-row items-center overflow-hidden"
            >
              <View className="w-12 h-12 bg-indigo-600 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="sparkles" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-black text-lg">Talk to AI Ally</Text>
                <Text className="text-gray-500 text-xs font-medium">Stuck? Ask your dedicated study buddy</Text>
              </View>
              <View className="bg-white/5 p-2 rounded-xl">
                <Ionicons name="chevron-forward" size={20} color="#4b5563" />
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </PremiumBackground>
  );
}
