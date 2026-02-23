import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useStories } from '@/src/hooks/use-stories';
import { useStoriesStore } from '@/src/stores/stories-store';
import { theme } from '@/src/theme';
import { StoryCircle } from './story-circle';
import { StoryViewer } from './story-viewer';

export function StoryRow() {
  const { data: stories } = useStories();
  const isViewed = useStoriesStore((s) => s.isViewed);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!stories || stories.length === 0) return null;

  return (
    <>
      <Animated.View entering={FadeInDown.delay(0).duration(400)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -theme.spacing.md }}
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: 4,
          }}
        >
          {stories.map((story, index) => (
            <StoryCircle
              key={story.id}
              imageUrl={story.image_url}
              title={story.title}
              seen={isViewed(story.id)}
              onPress={() => {
                setStartIndex(index);
                setViewerOpen(true);
              }}
            />
          ))}
        </ScrollView>
      </Animated.View>

      <StoryViewer
        stories={stories}
        initialIndex={startIndex}
        visible={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}
