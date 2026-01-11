import { Link } from "expo-router";
import { Text, View } from "react-native";
// import {Ionicons} from '@expo/vector-icons';
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Ionicons name="school" size={100} color="red" /> */}
      <Text className="text-red-500 bg-dark-200">Studdy Buddy app</Text>
      <Link href="/Tasks">
        <Text>Go to Tasks</Text>
      </Link>
      
    </View>
  );
}
