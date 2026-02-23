export const queryKeys = {
  cats: {
    all: ['cats'] as const,
    byOwner: (ownerId: string) => ['cats', ownerId] as const,
  },
  sessions: {
    all: ['sessions'] as const,
    byCat: (catId: string) => ['sessions', 'cat', catId] as const,
    today: (ownerId: string) => ['sessions', 'today', ownerId] as const,
    weekly: (ownerId: string) => ['sessions', 'weekly', ownerId] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
  },
  stories: {
    active: ['stories', 'active'] as const,
  },
  appConfig: {
    all: ['appConfig'] as const,
  },
};
