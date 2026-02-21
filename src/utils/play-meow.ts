import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

let meowSound: Audio.Sound | null = null;

export async function playMeow() {
  try {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Unload previous instance to avoid memory leaks
    if (meowSound) {
      await meowSound.unloadAsync();
      meowSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/meow.mp3'),
      { shouldPlay: true, volume: 0.1 }
    );
    meowSound = sound;

    // Auto-cleanup when done
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        meowSound = null;
      }
    });
  } catch {
    // Silently fail — sound is non-critical
  }
}
