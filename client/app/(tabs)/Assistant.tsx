import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import axios from 'axios';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { Config } from '../../constants/Config';
import { PremiumBackground } from '../components/PremiumBackground';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: 'Hello! I am your AI study buddy. How can I help you today?' },
  ]);
  const [inputText, setInputText] = useState('');
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Animation values for 3D Listening Orb
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (listening) {
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          ])
        ),
        Animated.loop(
          Animated.timing(rotateAnim, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          ])
        )
      ]).start();
    } else {
      pulseAnim.setValue(0);
      rotateAnim.setValue(0);
      floatAnim.setValue(0);
    }
  }, [listening]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => showSubscription.remove();
  }, []);

  /* ================= SPEECH RECOGNITION ================= */
  useSpeechRecognitionEvent('start', () => setListening(true));
  useSpeechRecognitionEvent('end', () => {
    setListening(false);
  });
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      handleSend(transcript, true);
    }
  });

  const toggleListening = async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
    } else {
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) return;
      Speech.stop();
      ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: false, continuous: false });
    }
  };

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (text: string, fromVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setProcessing(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await axios.post(
        `${Config.API_URL}/api/generate/ai/response`,
        { prompt: text }
      );

      let aiContent = "";
      if (typeof response.data === 'string') {
        try {
          const parsed = JSON.parse(response.data);
          aiContent = parsed.content || parsed;
        } catch {
          aiContent = response.data;
        }
      } else if (typeof response.data === 'object') {
        const raw = response.data;
        aiContent = raw.content || (typeof raw === 'string' ? JSON.parse(raw).content : "I didn't understand that.");
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: aiContent };
      setMessages(prev => [...prev, aiMsg]);

      if (fromVoice) {
        Speech.stop();
        Speech.speak(aiContent);
      }
    } catch (error) {
      console.log("AI Error", error);
      const errorMsg: Message = { id: Date.now().toString(), role: 'ai', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMsg]);
      if (fromVoice) {
        Speech.speak("Sorry, I'm having trouble connecting right now.");
      }
    } finally {
      setProcessing(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View className={`flex-row mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <View className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center mr-2 self-end mb-1">
            <Ionicons name="sparkles" size={14} color="white" />
          </View>
        )}
        <View
          className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
            ? 'bg-indigo-600 rounded-tr-none'
            : 'bg-gray-800 rounded-tl-none border border-gray-700'
            }`}
        >
          <Text className={`${isUser ? 'text-white' : 'text-gray-200'} text-base leading-6`}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const orbScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const orbOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1]
  });

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  return (
    <PremiumBackground>
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-center py-4 border-b border-gray-800">
          <Text className="text-white font-bold text-lg">AI Assistant</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            className="flex-1"
            keyboardShouldPersistTaps="handled"
          />

          {processing && (
            <View className="px-6 pb-2">
              <Text className="text-gray-500 text-xs italic ml-10">Thinking...</Text>
            </View>
          )}

          {/* INPUT AREA - WhatsApp style */}
          <View className="px-4 pb-6 pt-2 bg-black/20 backdrop-blur-lg">
            <View className="flex-row items-end bg-gray-900 border border-gray-800 rounded-[28px] px-2 py-1 shadow-2xl">
              <TextInput
                placeholder="Ask me anything..."
                placeholderTextColor="#64748b"
                className="flex-1 text-white px-4 py-3 text-base max-h-32"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              <View className="flex-row items-center h-12 pr-1">
                {inputText.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => handleSend(inputText)}
                    className="w-10 h-10 bg-indigo-600 rounded-full items-center justify-center"
                  >
                    <Ionicons name="arrow-up" size={24} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={toggleListening}
                    className={`w-10 h-10 rounded-full items-center justify-center ${listening ? 'bg-red-500' : 'bg-indigo-600/20 border border-indigo-500/30'}`}
                  >
                    <Ionicons name="mic" size={20} color={listening ? "white" : "#818cf8"} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* 3D LISTENING OVERLAY */}
          {listening && (
            <View className="absolute inset-0 bg-black/90 items-center justify-center z-50">
              <Animated.View style={{ transform: [{ translateY }] }} className="items-center">
                <View className="relative w-64 h-64 items-center justify-center">
                  {/* Glow Layers */}
                  <Animated.View
                    style={{
                      transform: [{ scale: orbScale }, { rotate: rotation }],
                      opacity: orbOpacity
                    }}
                    className="absolute"
                  >
                    <Svg width={240} height={240}>
                      <Defs>
                        <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <Stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                          <Stop offset="70%" stopColor="#818cf8" stopOpacity="0.3" />
                          <Stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </RadialGradient>
                      </Defs>
                      <Circle cx="120" cy="120" r="100" fill="url(#grad)" />
                    </Svg>
                  </Animated.View>

                  {/* Inner 3D-ish Orb */}
                  <Animated.View
                    style={{
                      transform: [{ scale: orbScale }]
                    }}
                    className="w-32 h-32 rounded-full overflow-hidden shadow-2xl"
                  >
                    <View className="w-full h-full bg-indigo-600 items-center justify-center">
                      <Ionicons name="mic" size={60} color="white" />
                      {/* Reflection highlight */}
                      <View className="absolute top-2 left-6 w-12 h-6 bg-white/30 rounded-full rotate-[-30deg]" />
                    </View>
                  </Animated.View>

                  {/* Outer Rings */}
                  <Animated.View
                    style={{
                      transform: [{ scale: Animated.multiply(orbScale, 1.4) }, { rotate: rotation }],
                      opacity: 0.3
                    }}
                    className="absolute border-2 border-dashed border-indigo-400 w-48 h-48 rounded-full"
                  />
                  <Animated.View
                    style={{
                      transform: [{ scale: Animated.multiply(orbScale, 1.8) }, { rotate: rotation }],
                      opacity: 0.1
                    }}
                    className="absolute border border-indigo-400 w-56 h-56 rounded-full"
                  />
                </View>

                <View className="mt-12 items-center">
                  <Text className="text-white text-3xl font-black mb-2 tracking-tight">Listening...</Text>
                  <Text className="text-indigo-300/60 text-lg font-medium">I'm all ears, talk to me</Text>
                </View>

                <TouchableOpacity
                  onPress={toggleListening}
                  className="mt-20 w-16 h-16 bg-white/10 rounded-full border border-white/20 items-center justify-center"
                >
                  <Ionicons name="close" size={32} color="white" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PremiumBackground>
  );
}
