import {
  startActivity,
  updateActivity,
  stopActivity,
} from 'expo-live-activity';

let currentActivityId: string | null = null;

const CONFIG = {
  backgroundColor: '141311',
  titleColor: 'FBFAF7',
  subtitleColor: 'CBBBA4',
  deepLinkUrl: '/session/live',
  imageSize: { width: 40 as const, height: 40 as const },
  imagePosition: 'left' as const,
  imageAlign: 'center' as const,
  contentFit: 'contain' as const,
  padding: { horizontal: 16, vertical: 12 },
};

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function startSessionActivity(catName: string, startTime: number) {
  if (process.env.EXPO_OS !== 'ios') return;
  try {
    const id = startActivity(
      {
        title: `${catName} is exercising`,
        progressBar: { date: startTime },
        imageName: 'paw',
        dynamicIslandImageName: 'paw',
      },
      CONFIG
    );
    currentActivityId = id ?? null;
  } catch {}
}

export function pauseSessionActivity(elapsedMs: number) {
  if (process.env.EXPO_OS !== 'ios' || !currentActivityId) return;
  try {
    updateActivity(currentActivityId, {
      title: 'Paused',
      subtitle: formatElapsed(elapsedMs),
      imageName: 'paw',
      dynamicIslandImageName: 'paw',
    });
  } catch {}
}

export function resumeSessionActivity(
  catName: string,
  effectiveStartTime: number
) {
  if (process.env.EXPO_OS !== 'ios' || !currentActivityId) return;
  try {
    updateActivity(currentActivityId, {
      title: `${catName} is exercising`,
      progressBar: { date: effectiveStartTime },
      imageName: 'paw',
      dynamicIslandImageName: 'paw',
    });
  } catch {}
}

export function stopSessionActivity() {
  if (process.env.EXPO_OS !== 'ios' || !currentActivityId) return;
  try {
    stopActivity(currentActivityId, {
      title: 'Session Complete',
      progressBar: { progress: 1 },
      imageName: 'paw',
      dynamicIslandImageName: 'paw',
    });
    currentActivityId = null;
  } catch {}
}

export function clearSessionActivity() {
  if (process.env.EXPO_OS !== 'ios' || !currentActivityId) return;
  try {
    stopActivity(currentActivityId, {
      title: 'Session Ended',
      progressBar: { progress: 1 },
      imageName: 'paw',
      dynamicIslandImageName: 'paw',
    });
    currentActivityId = null;
  } catch {}
}
