import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Linking,
} from "react-native";
import axios from "axios";
import { Config } from "@/constants/Config";
import { PremiumBackground } from "../../components/PremiumBackground";

export default function StudyMaterial() {
    const router = useRouter();
    const { id, title } = useLocalSearchParams();
    const [material, setMaterial] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const res = await axios.post(`${Config.API_URL}/api/generate/ai/study`, {
                    id,
                    title,
                });
                setMaterial(res.data);
            } catch (err) {
                console.error("STUDY FETCH ERROR:", err);
                setError("Failed to load study materials. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (id && title) {
            fetchMaterial();
        }
    }, [id, title]);

    const getResourceIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes("youtube")) return "logo-youtube";
        if (t.includes("github")) return "logo-github";
        if (t.includes("doc") || t.includes("article")) return "document-text-outline";
        return "link-outline";
    };

    const handleOpenLink = async (url: string) => {
        if (!url) return;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            }
        } catch (err) {
            console.error("LINK ERROR:", err);
        }
    };

    if (loading) {
        return (
            <PremiumBackground>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text className="text-white mt-4 font-medium">Curating your study material...</Text>
                </View>
            </PremiumBackground>
        );
    }

    if (error || !material) {
        return (
            <PremiumBackground>
                <View className="flex-1 items-center justify-center p-6">
                    <Ionicons name="alert-circle-outline" size={48} color="gray" />
                    <Text className="text-gray-400 mt-4 text-center">{error || "Something went wrong"}</Text>
                    <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-indigo-600 px-6 py-3 rounded-full">
                        <Text className="text-white font-bold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </PremiumBackground>
        );
    }

    return (
        <PremiumBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
                    {/* HEADER */}
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-5 bg-white/5 p-3 rounded-2xl border border-white/10"
                        >
                            <Ionicons name="arrow-back" size={20} color="white" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px]">Resource Center</Text>
                            <Text className="text-white text-2xl font-black tracking-tight" numberOfLines={1}>
                                {material.topic}
                            </Text>
                        </View>
                    </View>

                    {/* DESCRIPTION */}
                    <View className="bg-white/5 p-8 rounded-[40px] mb-10 border border-white/5 relative overflow-hidden">
                        <View className="absolute top-0 right-0 p-6 opacity-[0.05]">
                            <Ionicons name="bulb-outline" size={80} color="#818cf8" />
                        </View>
                        <Text className="text-indigo-400 text-[10px] font-black uppercase tracking-[2px] mb-4">Core Context</Text>
                        <Text className="text-gray-300 text-base leading-7 font-medium">
                            {material.description}
                        </Text>
                    </View>

                    {/* RESOURCES LIST */}
                    <Text className="text-white text-xl font-black mb-6 tracking-tight">External Intelligence</Text>

                    <View className="pb-20">
                        {material.resources.map((resource: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.8}
                                onPress={() => handleOpenLink(resource.url)}
                                className="bg-white/5 border border-white/10 rounded-[32px] p-6 mb-6 flex-row items-center shadow-2xl relative overflow-hidden"
                            >
                                <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-6 border border-white/5 ${resource.type.toLowerCase().includes('youtube') ? 'bg-red-500/10' :
                                    resource.type.toLowerCase().includes('github') ? 'bg-slate-500/10' :
                                        'bg-indigo-500/10'
                                    }`}>
                                    <Ionicons
                                        name={getResourceIcon(resource.type) as any}
                                        size={28}
                                        color={
                                            resource.type.toLowerCase().includes('youtube') ? '#ef4444' :
                                                resource.type.toLowerCase().includes('github') ? '#94a3b8' :
                                                    '#818cf8'
                                        }
                                    />
                                </View>

                                <View className="flex-1 pr-4">
                                    <Text className="text-gray-400 text-[9px] font-black uppercase tracking-[2px] mb-1">
                                        {resource.type}
                                    </Text>
                                    <Text className="text-white text-lg font-bold" numberOfLines={1}>
                                        {resource.title}
                                    </Text>
                                </View>

                                <View className="bg-white/5 p-3 rounded-full border border-white/5">
                                    <Ionicons name="open-outline" size={18} color="#818cf8" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </PremiumBackground>
    );
}
