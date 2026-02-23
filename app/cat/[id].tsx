import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useCats } from '@/src/hooks/use-cats';
import { useSessionsByCat } from '@/src/hooks/use-sessions';
import { useStreak } from '@/src/hooks/use-streak';
import type { CatInsights, CatProfile, Range, ToyRecommendation } from '@/src/lib/cat-fitness';
import { estimateRER, generateCatInsights, playCaloriesAsPercentOfRER, yearsToMonths } from '@/src/lib/cat-fitness';

import { CatFormSheet } from '@/src/components/cats/cat-form-sheet';
import { StatRow } from '@/src/components/insights/stat-row';
import { WeeklyRings } from '@/src/components/insights/weekly-rings';
import { Avatar } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Card } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';
import type { Cat, PlaySession } from '@/src/supabase/types';
import { theme } from '@/src/theme';

// --- Helpers ---

function rangeStr(range: Range): string {
  if (range.min === range.max) return `${range.min}`;
  return `${range.min}–${range.max}`;
}

function buildCatProfile(cat: Cat): CatProfile {
  return {
    age_months: cat.age_years != null ? yearsToMonths(cat.age_years) : 24,
    weight_kg: cat.weight_kg ?? 4.5,
    mobility_limitations: false,
    energy_level: cat.energy_level,
    is_indoor_only: true,
    is_anxious: false,
  };
}

function sessionsToFitnessFormat(
  sessions: PlaySession[] | undefined
): Array<{ activity_type: string; duration_minutes: number }> | null {
  if (!sessions || sessions.length === 0) return null;
  return sessions.map((s) => ({
    activity_type: s.activity_type,
    duration_minutes: s.duration_minutes,
  }));
}

function groupSessionsByDay(
  sessions: PlaySession[] | undefined
): Array<Array<{ activity_type: string; duration_minutes: number }>> | null {
  if (!sessions || sessions.length === 0) return null;
  const dayMap = new Map<string, Array<{ activity_type: string; duration_minutes: number }>>();
  for (const s of sessions) {
    const day = s.played_at.slice(0, 10);
    if (!dayMap.has(day)) dayMap.set(day, []);
    dayMap.get(day)!.push({
      activity_type: s.activity_type,
      duration_minutes: s.duration_minutes,
    });
  }
  return Array.from(dayMap.values());
}

const LIFE_STAGE_KEYS: Record<string, { key: string; emoji: string }> = {
  kitten: { key: 'catProfile.kitten', emoji: '\u{1F431}' },
  young_adult: { key: 'catProfile.youngAdult', emoji: '\u{1F408}' },
  mature_adult: { key: 'catProfile.matureAdult', emoji: '\u{1F408}\u200D\u2B1B' },
  senior: { key: 'catProfile.senior', emoji: '\u{1F9D3}' },
};

const INTENSITY_COLORS: Record<string, string> = {
  low: theme.colors.success,
  moderate: theme.colors.warning,
  high: theme.colors.danger,
};

// --- Sub-components ---

function SectionHeader({ title, emoji, delay = 0 }: { title: string; emoji: string; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <Text
        style={{
          fontFamily: theme.font.display,
          fontSize: 20,
          color: theme.colors.text,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        {emoji} {title}
      </Text>
    </Animated.View>
  );
}

function WarningBanner({ text, index }: { text: string; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 60).duration(400)}>
      <View
        style={{
          backgroundColor: theme.colors.warning + '18',
          borderLeftWidth: 3,
          borderLeftColor: theme.colors.warning,
          borderRadius: theme.radius.sm,
          padding: 12,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 13,
            color: theme.colors.ink800,
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </Animated.View>
  );
}

function ToyCard({ toy, index }: { toy: ToyRecommendation; index: number }) {
  const scorePercent = Math.round(toy.suitability_score * 100);
  const scoreColor =
    scorePercent >= 70 ? theme.colors.success : scorePercent >= 40 ? theme.colors.warning : theme.colors.danger;

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
      <View
        style={{
          width: 180,
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: theme.radius.lg,
          padding: 14,
          gap: 8,
          borderCurve: 'continuous',
          boxShadow: theme.shadow.sm.boxShadow,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 28 }}>{toy.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: theme.font.bodySemiBold,
                fontSize: 13,
                color: theme.colors.text,
              }}
              numberOfLines={2}
            >
              {toy.label}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              flex: 1,
              height: 6,
              backgroundColor: theme.colors.taupe200,
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${scorePercent}%`,
                height: '100%',
                backgroundColor: scoreColor,
                borderRadius: 3,
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: theme.font.bodySemiBold,
              fontSize: 11,
              color: scoreColor,
              fontVariant: ['tabular-nums'],
              width: 32,
              textAlign: 'right',
            }}
          >
            {scorePercent}%
          </Text>
        </View>

        <Badge
          label={toy.intensity}
          color={INTENSITY_COLORS[toy.intensity] + '20'}
          textColor={INTENSITY_COLORS[toy.intensity]}
          style={{ alignSelf: 'flex-start' }}
        />
      </View>
    </Animated.View>
  );
}

function StopRuleItem({ rule, index }: { rule: string; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(350)}>
      <View
        style={{
          flexDirection: 'row',
          gap: 8,
          paddingVertical: 6,
        }}
      >
        <Text style={{ fontSize: 14, color: theme.colors.danger }}>{'\u26D4'}</Text>
        <Text
          style={{
            fontFamily: theme.font.body,
            fontSize: 13,
            color: theme.colors.textSecondary,
            flex: 1,
            lineHeight: 18,
          }}
        >
          {rule}
        </Text>
      </View>
    </Animated.View>
  );
}

// --- Main Screen ---

export default function CatProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: cats, isLoading: catsLoading } = useCats();
  const [showEditSheet, setShowEditSheet] = useState(false);
  const { data: allSessions, isLoading: sessionsLoading } = useSessionsByCat(id ?? null);
  const streak = useStreak(allSessions);

  const cat = cats?.find((c) => c.id === id);

  // Derive today's sessions from all sessions (local date, not UTC)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todaySessions = useMemo(
    () => allSessions?.filter((s) => s.played_at.slice(0, 10) === todayStr),
    [allSessions, todayStr]
  );

  // Generate insights
  const insights = useMemo<CatInsights | null>(() => {
    if (!cat) return null;
    const profile = buildCatProfile(cat);
    const todayFormatted = sessionsToFitnessFormat(todaySessions);
    const weeklyFormatted = groupSessionsByDay(allSessions);
    return generateCatInsights(profile, todayFormatted, weeklyFormatted);
  }, [cat, todaySessions, allSessions]);

  const isLoading = catsLoading || sessionsLoading;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, paddingTop: insets.top + 16, paddingHorizontal: theme.spacing.md }}>
        <Skeleton width="100%" height={120} borderRadius={theme.radius.lg} />
        <View style={{ height: 16 }} />
        <Skeleton width="100%" height={200} borderRadius={theme.radius.lg} />
        <View style={{ height: 16 }} />
        <Skeleton width="100%" height={160} borderRadius={theme.radius.lg} />
      </View>
    );
  }

  if (!cat || !insights) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: theme.font.body, fontSize: 16, color: theme.colors.textMuted }}>
          {t('catProfile.catNotFound')}
        </Text>
      </View>
    );
  }

  const { play_plan, toy_recommendations, today_calories, weekly_calories, warnings } = insights;
  const rer = estimateRER(cat.weight_kg ?? 4.5);
  const lifeStageInfo = LIFE_STAGE_KEYS[play_plan.life_stage] ?? { key: play_plan.life_stage, emoji: '\u{1F431}' };

  const topToys = toy_recommendations.slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <View style={{ paddingHorizontal: theme.spacing.md, paddingVertical: 8 }}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </Pressable>
        </View>

        {/* Hero header */}
        <Animated.View entering={FadeInDown.duration(500)} style={{ paddingHorizontal: theme.spacing.md }}>
          <Card elevated style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
            <Avatar emoji={cat.emoji} imageBase64={cat.image_base64} size={72} />
            <Text
              style={{
                fontFamily: theme.font.display,
                fontSize: 28,
                color: theme.colors.text,
              }}
            >
              {cat.name}
            </Text>
            {cat.breed && (
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.textMuted,
                  marginTop: -8,
                }}
              >
                {cat.breed}
              </Text>
            )}

            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Badge
                label={`${lifeStageInfo.emoji} ${t(lifeStageInfo.key)}`}
                color={theme.colors.ginger400 + '25'}
                textColor={theme.colors.ginger700}
              />
              {cat.weight_kg != null && (
                <Badge
                  label={`${cat.weight_kg} kg`}
                  color={theme.colors.taupe200}
                  textColor={theme.colors.textSecondary}
                />
              )}
              {cat.age_years != null && (
                <Badge
                  label={`${cat.age_years} yr`}
                  color={theme.colors.taupe200}
                  textColor={theme.colors.textSecondary}
                />
              )}
              {streak > 0 && (
                <Badge
                  label={t('catProfile.dayStreak', { count: streak })}
                  icon={'\u{1F525}'}
                  color={theme.colors.ginger400 + '30'}
                  textColor={theme.colors.ginger700}
                />
              )}
            </View>

            <Pressable
              onPress={() => setShowEditSheet(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit cat"
              style={{
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: theme.radius.full,
                borderWidth: 1,
                borderColor: theme.colors.borderSubtle,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.font.bodyMedium,
                  fontSize: 13,
                  color: theme.colors.primary,
                }}
              >
                {t('common.edit')}
              </Text>
            </Pressable>
          </Card>
        </Animated.View>

        {/* Warnings */}
        {warnings.length > 0 && (
          <View style={{ paddingHorizontal: theme.spacing.md, marginTop: 16 }}>
            {warnings.map((w, i) => (
              <WarningBanner key={i} text={w} index={i} />
            ))}
          </View>
        )}

        {/* Progress */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <SectionHeader title={t('catProfile.progress')} emoji={'\u{1F3AF}'} delay={100} />
          <WeeklyRings
            sessions={allSessions ?? []}
            targetMinutes={play_plan.total_minutes_per_day_range.max}
            streak={streak}
          />
        </View>

        {/* Play Plan */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <SectionHeader title={t('catProfile.playPlan')} emoji={'\u{1F3C3}'} delay={200} />
          <Animated.View entering={FadeInDown.delay(250).duration(400)}>
            <Card elevated>
              <StatRow
                icon={'\u{1F504}'}
                label={t('catProfile.sessionsPerDay')}
                value={rangeStr(play_plan.sessions_per_day_range)}
              />
              <StatRow
                icon={'\u23F1\uFE0F'}
                label={t('catProfile.minutesPerSession')}
                value={rangeStr(play_plan.minutes_per_session_range)}
              />
              <StatRow
                icon={'\u{1F4CA}'}
                label={t('catProfile.totalDailyMinutes')}
                value={rangeStr(play_plan.total_minutes_per_day_range)}
              />
              <StatRow
                icon={'\u{1F4AA}'}
                label={t('catProfile.intensity')}
                value={play_plan.intensity_profile.level.charAt(0).toUpperCase() + play_plan.intensity_profile.level.slice(1)}
              />
              <StatRow
                icon={'\u{1F4C5}'}
                label={t('catProfile.daysPerWeek')}
                value={play_plan.days_per_week}
              />
              <View style={{ marginTop: 12 }}>
                <Text
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 13,
                    color: theme.colors.textMuted,
                    lineHeight: 18,
                    fontStyle: 'italic',
                  }}
                >
                  {play_plan.intensity_profile.description}
                </Text>
              </View>
            </Card>
          </Animated.View>
        </View>

        {/* Calorie Insights */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <SectionHeader title={t('catProfile.calorieInsights')} emoji={'\u{1F525}'} delay={300} />
          <Animated.View entering={FadeInDown.delay(350).duration(400)}>
            <Card elevated>
              <StatRow
                icon={'\u{2764}\uFE0F'}
                label={t('catProfile.restingEnergy')}
                value={`${rer} kcal/day`}
              />
              {today_calories && (
                <>
                  <StatRow
                    icon={'\u{1F3C3}'}
                    label={t('catProfile.todaysPlayBurn')}
                    value={`${today_calories.total_estimated_kcal.min}–${today_calories.total_estimated_kcal.max} kcal`}
                  />
                  <StatRow
                    icon={'\u{1F4CA}'}
                    label={t('catProfile.rerFromPlay')}
                    value={`${playCaloriesAsPercentOfRER(today_calories.total_estimated_kcal, cat.weight_kg ?? 4.5).min}–${playCaloriesAsPercentOfRER(today_calories.total_estimated_kcal, cat.weight_kg ?? 4.5).max}%`}
                  />
                </>
              )}
              {weekly_calories && (
                <>
                  <StatRow
                    icon={'\u{1F4C6}'}
                    label={t('catProfile.weeklyTotal')}
                    value={`${weekly_calories.total_estimated_kcal.min}–${weekly_calories.total_estimated_kcal.max} kcal`}
                  />
                  <StatRow
                    icon={'\u{1F4C8}'}
                    label={t('catProfile.dailyAverage')}
                    value={`${weekly_calories.daily_average_kcal.min}–${weekly_calories.daily_average_kcal.max} kcal`}
                  />
                  <StatRow
                    icon={'\u2705'}
                    label={t('catProfile.activeDays')}
                    value={t('catProfile.activeDaysValue', { active: weekly_calories.active_days })}
                  />
                </>
              )}
              {!today_calories && !weekly_calories && (
                <Text
                  style={{
                    fontFamily: theme.font.body,
                    fontSize: 14,
                    color: theme.colors.textMuted,
                    textAlign: 'center',
                    paddingVertical: 16,
                  }}
                >
                  {t('catProfile.noCalorieData')}
                </Text>
              )}
            </Card>
          </Animated.View>
        </View>

        {/* Toy Recommendations */}
        <View>
          <View style={{ paddingHorizontal: theme.spacing.md }}>
            <SectionHeader title={t('catProfile.toyRecommendations')} emoji={'\u{1FA84}'} delay={400} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: theme.spacing.md,
              gap: 12,
            }}
          >
            {topToys.map((toy, i) => (
              <ToyCard key={toy.toy_category} toy={toy} index={i} />
            ))}
          </ScrollView>
        </View>

        {/* Progression Plan */}
        {play_plan.progression_plan && play_plan.progression_plan.length > 0 && (
          <View style={{ paddingHorizontal: theme.spacing.md }}>
            <SectionHeader title={t('catProfile.progressionPlan')} emoji={'\u{1F4C8}'} delay={450} />
            {play_plan.progression_plan.map((week, i) => (
              <Animated.View key={week.week} entering={FadeInDown.delay(480 + i * 60).duration(400)}>
                <Card
                  style={{
                    marginBottom: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: i === 0 ? theme.colors.primary : theme.colors.taupe300,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                      style={{
                        fontFamily: theme.font.bodySemiBold,
                        fontSize: 15,
                        color: theme.colors.text,
                      }}
                    >
                      {t('catProfile.week', { number: week.week })}
                    </Text>
                    <Badge
                      label={`${week.sessions_per_day}x/day - ${rangeStr(week.minutes_per_session)} min`}
                      color={theme.colors.taupe200}
                      textColor={theme.colors.textSecondary}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: theme.font.body,
                      fontSize: 13,
                      color: theme.colors.textMuted,
                      marginTop: 6,
                      lineHeight: 18,
                    }}
                  >
                    {week.notes}
                  </Text>
                </Card>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Cooldown Notes */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <SectionHeader title={t('catProfile.cooldown')} emoji={'\u{1F4A8}'} delay={500} />
          <Animated.View entering={FadeInDown.delay(530).duration(400)}>
            <Card>
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                {play_plan.cooldown_notes}
              </Text>
            </Card>
          </Animated.View>
        </View>

        {/* Hunt-Eat-Groom-Sleep */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <SectionHeader title={t('catProfile.naturalCycle')} emoji={'\u{1F3AF}'} delay={550} />
          <Animated.View entering={FadeInDown.delay(580).duration(400)}>
            <Card
              style={{
                backgroundColor: theme.colors.ginger400 + '12',
                borderWidth: 1,
                borderColor: theme.colors.ginger400 + '30',
              }}
            >
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                {play_plan.hunt_eat_groom_sleep_sequence}
              </Text>
            </Card>
          </Animated.View>
        </View>

        {/* Stop Rules */}
        <View style={{ paddingHorizontal: theme.spacing.md }}>
          <SectionHeader title={t('catProfile.whenToStop')} emoji={'\u26A0\uFE0F'} delay={600} />
          <Animated.View entering={FadeInDown.delay(630).duration(400)}>
            <Card>
              {play_plan.stop_rules.map((rule, i) => (
                <StopRuleItem key={i} rule={rule} index={i} />
              ))}
            </Card>
          </Animated.View>
        </View>

        {/* Disclaimer */}
        <View style={{ paddingHorizontal: theme.spacing.md, marginTop: 24 }}>
          <Animated.View entering={FadeInDown.delay(700).duration(400)}>
            <View
              style={{
                backgroundColor: theme.colors.taupe200 + '40',
                borderRadius: theme.radius.md,
                padding: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.font.body,
                  fontSize: 11,
                  color: theme.colors.textMuted,
                  lineHeight: 16,
                  textAlign: 'center',
                }}
              >
                {insights.disclaimer}
              </Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      <Modal
        visible={showEditSheet}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditSheet(false)}
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
          <CatFormSheet onClose={() => setShowEditSheet(false)} cat={cat} />
        </View>
      </Modal>
    </View>
  );
}
