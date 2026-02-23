import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TabBar } from '@/src/components/layout/tab-bar';
import { theme } from '@/src/theme';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="cats" options={{ title: t('tabs.myCats') }} />
      <Tabs.Screen name="insights" options={{ title: t('tabs.insights') }} />
      <Tabs.Screen name="community" options={{ title: t('tabs.community') }} />
    </Tabs>
  );
}
