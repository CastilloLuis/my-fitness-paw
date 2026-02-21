import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CatFormSheet } from '@/src/components/cats/cat-form-sheet';
import { Avatar } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { EmptyState } from '@/src/components/ui/empty-state';
import { Skeleton } from '@/src/components/ui/skeleton';
import { useCats, useDeleteCat } from '@/src/hooks/use-cats';
import { useSessionsByCat } from '@/src/hooks/use-sessions';
import { useStreak } from '@/src/hooks/use-streak';
import type { Cat } from '@/src/supabase/types';
import { theme } from '@/src/theme';

function CatListItem({ cat, onEdit }: { cat: Cat; onEdit: () => void }) {
  const { data: sessions } = useSessionsByCat(cat.id);
  const streak = useStreak(sessions);
  const deleteCat = useDeleteCat();

  const totalSessions = sessions?.length ?? 0;
  const totalMinutes = sessions?.reduce((s, sess) => s + sess.duration_minutes, 0) ?? 0;

  const energyLabels: Record<string, string> = {
    couch_potato: '\u{1F6CB}\uFE0F Couch Potato',
    balanced: '\u{2696}\uFE0F Balanced',
    wild_hunter: '\u{26A1} Wild Hunter',
  };

  return (
    <Card elevated style={{ gap: 12 }} onPress={() => router.push(`/cat/${cat.id}`)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Avatar emoji={cat.emoji} imageBase64={cat.image_base64} size={56} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 18,
              color: theme.colors.text,
            }}
          >
            {cat.name}
          </Text>
          {cat.breed && (
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.textMuted,
              }}
            >
              {cat.breed}
            </Text>
          )}
        </View>
        {streak > 0 && (
          <Badge
            label={`${streak}`}
            icon={'\u{1F525}'}
            color={theme.colors.ginger400 + '30'}
            textColor={theme.colors.ginger700}
          />
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {cat.age_years != null && (
          <Badge label={`${cat.age_years}y`} color={theme.colors.taupe200} textColor={theme.colors.textSecondary} />
        )}
        {cat.weight_kg != null && (
          <Badge label={`${cat.weight_kg}kg`} color={theme.colors.taupe200} textColor={theme.colors.textSecondary} />
        )}
        <Badge
          label={energyLabels[cat.energy_level] || cat.energy_level}
          color={theme.colors.taupe200}
          textColor={theme.colors.textSecondary}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderSubtle,
        }}
      >
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 13,
            color: theme.colors.textMuted,
          }}
        >
          {totalSessions} sessions - {totalMinutes} min total
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable
            onPress={onEdit}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${cat.name}`}
            hitSlop={12}
          >
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.primary,
              }}
            >
              Edit
            </Text>
          </Pressable>
          <Pressable
            onPress={() => deleteCat.mutate(cat.id)}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${cat.name}`}
            hitSlop={12}
          >
            <Text
              style={{
                fontFamily: theme.font.body,
                fontSize: 13,
                color: theme.colors.danger,
              }}
            >
              Remove
            </Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

export default function CatsScreen() {
  const insets = useSafeAreaInsets();
  const { data: cats, isLoading } = useCats();
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | undefined>(undefined);

  const openAdd = () => {
    setEditingCat(undefined);
    setShowFormSheet(true);
  };

  const openEdit = (cat: Cat) => {
    setEditingCat(cat);
    setShowFormSheet(true);
  };

  const closeForm = () => {
    setShowFormSheet(false);
    setEditingCat(undefined);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: theme.spacing.md,
          paddingBottom: insets.bottom + 100,
          gap: theme.spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(0).duration(400)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: theme.font.display,
              fontSize: 26,
              color: theme.colors.text,
            }}
          >
            My Cats
          </Text>
          <Button
            title="Add"
            onPress={openAdd}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: theme.radius.full,
            }}
          />
        </Animated.View>

        {isLoading ? (
          <View style={{ gap: 12 }}>
            <Skeleton width="100%" height={140} borderRadius={theme.radius.lg} />
            <Skeleton width="100%" height={140} borderRadius={theme.radius.lg} />
          </View>
        ) : cats && cats.length > 0 ? (
          cats.map((cat, i) => (
            <Animated.View
              key={cat.id}
              entering={FadeInDown.delay(i * 80).duration(400)}
            >
              <CatListItem cat={cat} onEdit={() => openEdit(cat)} />
            </Animated.View>
          ))
        ) : (
          <EmptyState
            emoji={'\u{1F408}'}
            title="No cats yet"
            message="Add your first cat to start tracking their activity!"
            actionTitle="Add a Cat"
            onAction={openAdd}
          />
        )}
      </ScrollView>

      <Modal
        visible={showFormSheet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeForm}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.bg,
            paddingTop: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 5,
              borderRadius: 3,
              backgroundColor: theme.colors.taupe300,
              alignSelf: 'center',
              marginBottom: 8,
            }}
          />
          <CatFormSheet onClose={closeForm} cat={editingCat} />
        </View>
      </Modal>
    </View>
  );
}
