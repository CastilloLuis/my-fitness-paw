import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@/src/components/layout/tab-bar';
import { theme } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="cats" options={{ title: 'Cats' }} />
      <Tabs.Screen name="insights" options={{ title: 'Insights' }} />
    </Tabs>
  );
}
