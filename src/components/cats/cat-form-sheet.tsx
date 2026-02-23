import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { theme } from '@/src/theme';
import { useCreateCat, useUpdateCat } from '@/src/hooks/use-cats';
import type { Cat, EnergyLevel } from '@/src/supabase/types';

const ENERGY_LEVELS: { value: EnergyLevel; labelKey: string; emoji: string }[] = [
  { value: 'couch_potato', labelKey: 'cats.couchPotato', emoji: '\u{1F6CB}\uFE0F' },
  { value: 'balanced', labelKey: 'cats.balanced', emoji: '\u{2696}\uFE0F' },
  { value: 'wild_hunter', labelKey: 'cats.wildHunter', emoji: '\u{26A1}' },
];

interface CatFormSheetProps {
  onClose: () => void;
  cat?: Cat;
}

export function CatFormSheet({ onClose, cat }: CatFormSheetProps) {
  const { t } = useTranslation();
  const isEdit = !!cat;

  const [name, setName] = useState(cat?.name ?? '');
  const [breed, setBreed] = useState(cat?.breed ?? '');
  const [ageYears, setAgeYears] = useState(cat?.age_years?.toString() ?? '');
  const [weightKg, setWeightKg] = useState(cat?.weight_kg?.toString() ?? '');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(cat?.energy_level ?? 'balanced');
  const [imageBase64, setImageBase64] = useState<string | null>(cat?.image_base64 ?? null);
  const [error, setError] = useState('');

  const createCat = useCreateCat();
  const updateCat = useUpdateCat();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
      exif: false,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageBase64(result.assets[0].base64);
      if (process.env.EXPO_OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError(t('cats.pleaseName'));
      return;
    }

    const catData = {
      name: name.trim(),
      breed: breed.trim() || null,
      age_years: ageYears ? parseInt(ageYears, 10) : null,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      energy_level: energyLevel,
      emoji: '\u{1F431}',
      image_base64: imageBase64,
    };

    try {
      if (isEdit) {
        await updateCat.mutateAsync({ catId: cat.id, updates: catData });
      } else {
        await createCat.mutateAsync(catData);
      }
      if (process.env.EXPO_OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onClose();
    } catch (e: any) {
      setError(e.message || (isEdit ? t('cats.failedToUpdate') : t('cats.failedToAdd')));
    }
  };

  const isPending = createCat.isPending || updateCat.isPending;
  const photoSize = 100;

  return (
    <KeyboardAvoidingView
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          gap: theme.spacing.md,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            fontFamily: theme.font.display,
            fontSize: 24,
            color: theme.colors.text,
            textAlign: 'center',
          }}
        >
          {isEdit ? t('cats.editCat') : t('cats.addNewCat')}
        </Text>

        {/* Photo section */}
        <View style={{ alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={pickImage}
            accessibilityRole="button"
            accessibilityLabel={imageBase64 ? t('cats.changePhoto') : t('cats.addPhoto')}
            style={{
              width: photoSize,
              height: photoSize,
              borderRadius: photoSize / 2,
              backgroundColor: theme.colors.cream200,
              alignItems: 'center',
              justifyContent: 'center',
              borderCurve: 'continuous',
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: theme.colors.borderSubtle,
              borderStyle: 'dashed',
            }}
          >
            {imageBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                style={{ width: photoSize, height: photoSize }}
                contentFit="cover"
              />
            ) : (
              <Text style={{ fontSize: 40 }}>{'\u{1F431}'}</Text>
            )}
          </Pressable>
          <Pressable onPress={pickImage} hitSlop={8}>
            <Text
              style={{
                fontFamily: theme.font.bodyMedium,
                fontSize: 14,
                color: theme.colors.primary,
              }}
            >
              {imageBase64 ? t('cats.changePhoto') : t('cats.addPhoto')}
            </Text>
          </Pressable>
          {imageBase64 && (
            <Pressable
              onPress={() => setImageBase64(null)}
              hitSlop={8}
            >
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 13,
                  color: theme.colors.danger,
                }}
              >
                {t('cats.removePhoto')}
              </Text>
            </Pressable>
          )}
        </View>

        <Input
          label={t('cats.catName')}
          value={name}
          onChangeText={setName}
          error={error && !name.trim() ? error : undefined}
        />
        <Input label={t('cats.breedOptional')} value={breed} onChangeText={setBreed} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input
              label={t('cats.ageYears')}
              value={ageYears}
              onChangeText={setAgeYears}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label={t('cats.weightKg')}
              value={weightKg}
              onChangeText={setWeightKg}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Energy level picker */}
        <View>
          <Text
            style={{
              fontFamily: theme.font.bodyMedium,
              fontSize: 14,
              color: theme.colors.textMuted,
              marginBottom: 8,
            }}
          >
            {t('cats.energyLevel')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {ENERGY_LEVELS.map((level) => (
              <Pressable
                key={level.value}
                onPress={() => {
                  setEnergyLevel(level.value);
                  if (process.env.EXPO_OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={t(level.labelKey)}
                accessibilityState={{ selected: energyLevel === level.value }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: theme.radius.md,
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor:
                    energyLevel === level.value
                      ? theme.colors.ginger400 + '20'
                      : theme.colors.surface,
                  borderWidth: energyLevel === level.value ? 1.5 : 1,
                  borderColor:
                    energyLevel === level.value
                      ? theme.colors.primary
                      : theme.colors.borderSubtle,
                  borderCurve: 'continuous',
                }}
              >
                <Text style={{ fontSize: 20 }}>{level.emoji}</Text>
                <Text
                  style={{
                    fontFamily:
                      energyLevel === level.value
                        ? theme.font.bodySemiBold
                        : theme.font.body,
                    fontSize: 11,
                    color:
                      energyLevel === level.value
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                    textAlign: 'center',
                  }}
                >
                  {t(level.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error && name.trim() ? (
          <Text
            style={{
              fontFamily: theme.font.body,
              fontSize: 13,
              color: theme.colors.danger,
              textAlign: 'center',
            }}
            selectable
          >
            {error}
          </Text>
        ) : null}

        <View style={{ gap: 8, marginTop: 8 }}>
          <Button
            title={isEdit ? t('cats.saveChanges') : t('onboarding.addCat')}
            onPress={handleSave}
            loading={isPending}
          />
          <Button title={t('common.cancel')} onPress={onClose} variant="ghost" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
