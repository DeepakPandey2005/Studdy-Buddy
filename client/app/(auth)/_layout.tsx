// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthLayout() {
  return (
    <LinearGradient
      colors={['#0F2027', '#203A43', '#2C5364']}
      style={{ flex: 1 }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </LinearGradient>
  );
}
