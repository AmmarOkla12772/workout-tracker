import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="dumbbell" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Progress",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="chart-line" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cheese"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="gear" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
