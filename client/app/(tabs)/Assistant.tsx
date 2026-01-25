import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import axios from 'axios';

import { Config } from '../../constants/Config';

export default function Assistant() {
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userText, setUserText] = useState('');
  const [aiText, setAiText] = useState('');

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  /* ================= ANIMATION ================= */
  useEffect(() => {
    if (listening) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.6,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(opacityAnim, {
              toValue: 0.25,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(0.6);
    }
  }, [listening]);

  /* ================= SPEECH RECOGNITION EVENTS ================= */
  useSpeechRecognitionEvent('start', () => setListening(true));
  useSpeechRecognitionEvent('end', () => {
    setListening(false);
    setProcessing(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript;
    if (transcript) {
      setUserText(transcript);
      setProcessing(true);
      sendToAI(transcript);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('Speech recognition error:', event.error, event.message);
    setListening(false);
    setProcessing(false);
  });

  /* ================= SPEECH → TEXT ================= */
  const startListening = async () => {
    setAiText('');
    setUserText('');

    // Request permissions
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn('Permissions not granted', result);
      return;
    }

    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: false,
      continuous: false,
    });
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  /* ================= AI API CALL ================= */
  const sendToAI = async (message: string) => {
    try {
      const response = await axios.post(
        `${Config.API_URL}/api/generate/ai/response`,
        { prompt: message }
      );

      // API returns: "{\"content\":\"Hello...\"}"
      const parsed = JSON.parse(response.data);
      const aiResponse = parsed.content;

      setAiText(aiResponse);

      speak(aiResponse);
    } catch (error) {
      setAiText('Sorry, something went wrong.');
      speak('Sorry, something went wrong.');
    } finally {
      setProcessing(false);
    }
  };

  /* ================= TEXT → SPEECH ================= */
  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'en',
      rate: 0.95,
      pitch: 1.05,
    });
  };

  return (
    <View className="flex-1 bg-black items-center justify-center px-6">

      {/* TITLE */}
      <Text className="text-white text-3xl font-bold mb-1">
        AI Assistant
      </Text>
      <Text className="text-gray-400 text-center mb-10">
        Speak naturally. I’ll handle the rest.
      </Text>

      {/* GLOW RING */}
      {listening && (
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
          className="absolute w-72 h-72 rounded-full bg-blue-600"
        />
      )}

      {/* MIC BUTTON */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={listening ? stopListening : startListening}
        className={`w-36 h-36 rounded-full items-center justify-center shadow-2xl ${listening ? 'bg-blue-600' : 'bg-gray-800'
          }`}
      >
        {processing ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Ionicons
            name={listening ? 'mic' : 'mic-outline'}
            size={46}
            color="white"
          />
        )}
      </TouchableOpacity>

      {/* STATUS */}
      <Text className="text-lg font-semibold text-white mt-8">
        {listening
          ? 'Listening...'
          : processing
            ? 'Thinking...'
            : 'Tap to Speak'}
      </Text>

      {/* TRANSCRIPTS */}
      {userText !== '' && (
        <Text className="text-gray-400 mt-4 text-center italic">
          “{userText}”
        </Text>
      )}

      {aiText !== '' && (
        <View className="bg-gray-900 mt-6 px-5 py-4 rounded-2xl">
          <Text className="text-white text-center">
            {aiText}
          </Text>
        </View>
      )}
    </View>
  );
}
