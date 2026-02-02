import { Stack } from "expo-router";
import "./global.css";
import { Provider } from "react-redux";
import { store } from "./store";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(pages)" />
        <Stack.Screen name="task/[id]" />
      </Stack>
    </Provider>
  );
}
