import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import axios from 'axios';

import { Config } from '../../constants/Config';
import { PremiumBackground } from '../components/PremiumBackground';

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

  // Animation values for listening indicator
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const scaleAnim3 = useRef(new Animated.Value(1)).current;
  const scaleAnim4 = useRef(new Animated.Value(1)).current;

  // Pulse animation for mic
  useEffect(() => {
    if (listening) {
      const pulse = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(anim, { toValue: 1.5, duration: 500, delay, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
          ])
        );
      };

      Animated.parallel([
        pulse(scaleAnim1, 0),
        pulse(scaleAnim2, 200),
        pulse(scaleAnim3, 400),
        pulse(scaleAnim4, 600),
      ]).start();
    } else {
      scaleAnim1.setValue(1);
      scaleAnim2.setValue(1);
      scaleAnim3.setValue(1);
      scaleAnim4.setValue(1);
    }
  }, [listening]);

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
      // Stop any current speech
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

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await axios.post(
        `${Config.API_URL}/api/generate/ai/response`,
        { prompt: text } // Backend expects { prompt: "..." }
      );

      // Backend returns stringified JSON: "{\"content\":\"...\"}"
      // Or sometimes directly the content depending on previous edits
      let aiContent = "";

      if (typeof response.data === 'string') {
        try {
          const parsed = JSON.parse(response.data);
          aiContent = parsed.content || parsed;
        } catch {
          aiContent = response.data;
        }
      } else if (typeof response.data === 'object') {
        // If backend returns object directly
        // Checks based on typical response { content: "..." } or nested
        const raw = response.data;
        if (typeof raw === 'string') {
          const parsed = JSON.parse(raw);
          aiContent = parsed.content;
        } else {
          aiContent = raw.content || "I didn't understand that.";
        }
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: aiContent };
      setMessages(prev => [...prev, aiMsg]);

      // Speak the response if from voice
      if (fromVoice) {
        // Stop any previous speech just in case
        Speech.stop();
        Speech.speak(aiContent, {
          // You can adjust rate/pitch here if needed
          // rate: 1.1 
        });
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

  return (
    <PremiumBackground>
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-center py-4 border-b border-gray-800">
          <Text className="text-white font-bold text-lg">AI Assistant</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
          />

          {processing && (
            <View className="px-6 pb-2">
              <Text className="text-gray-500 text-xs italic ml-10">Thinking...</Text>
            </View>
          )}

          {/* INPUT AREA */}
          <View className="px-4 pb-6 pt-2 border-t border-gray-800">
            <View className="flex-row items-center bg-gray-900 border border-gray-800 rounded-full px-2 py-1">
              <TextInput
                placeholder="Ask me anything..."
                placeholderTextColor="#64748b"
                className="flex-1 text-white px-4 py-3 text-base max-h-24"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              {inputText.length > 0 ? (
                <TouchableOpacity
                  onPress={() => handleSend(inputText)}
                  className="w-10 h-10 bg-indigo-600 rounded-full items-center justify-center m-1"
                >
                  <Ionicons name="arrow-up" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={toggleListening}
                  className={`w-10 h-10 rounded-full items-center justify-center m-1 ${listening ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                  <Ionicons name="mic" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* LISTENING OVERLAY */}
          {listening && (
            <View className="absolute inset-0 bg-black/80 items-center justify-center z-50">
              <View className="items-center">
                <View className="flex-row items-center space-x-4 mb-8 h-20">
                  <Animated.View style={{ transform: [{ scaleY: scaleAnim1 }] }} className="w-3 h-12 bg-blue-500 rounded-full mx-1" />
                  <Animated.View style={{ transform: [{ scaleY: scaleAnim2 }] }} className="w-3 h-20 bg-red-500 rounded-full mx-1" />
                  <Animated.View style={{ transform: [{ scaleY: scaleAnim3 }] }} className="w-3 h-16 bg-yellow-500 rounded-full mx-1" />
                  <Animated.View style={{ transform: [{ scaleY: scaleAnim4 }] }} className="w-3 h-10 bg-green-500 rounded-full mx-1" />
                </View>
                <Text className="text-white text-2xl font-bold mb-2">Listening...</Text>
                <Text className="text-gray-400 text-base">Say something...</Text>

                <TouchableOpacity
                  onPress={toggleListening}
                  className="mt-12 bg-gray-800 p-4 rounded-full border border-gray-700"
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PremiumBackground>
  );
}
