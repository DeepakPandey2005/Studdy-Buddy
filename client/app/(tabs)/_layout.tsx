import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
const _layout = () => {
  return (
    // make sure to add at top of file: import { Ionicons } from '@expo/vector-icons'

    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="Tasks"
        options={{
          title: 'Tasks',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="Assistant"
        options={{
          title: 'Assistant',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="compass" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}

export default _layout  