import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { AppImage } from '../common/AppImage';
import { HOME_FALLBACK_ARTWORK_URL } from '../../utils/home';

interface HomeArtworkCollageProps {
  artworkUrls: string[];
  variant?: 'feature' | 'compact';
}

export function HomeArtworkCollage({
  artworkUrls,
  variant = 'feature',
}: HomeArtworkCollageProps): React.JSX.Element {
  const collageArtwork = [...artworkUrls];

  while (collageArtwork.length < 4) {
    collageArtwork.push(HOME_FALLBACK_ARTWORK_URL);
  }

  const gridStyle =
    variant === 'compact' ? styles.compactGrid : styles.featureGrid;
  const imageStyle =
    variant === 'compact' ? styles.compactImage : styles.featureImage;

  return (
    <View style={[styles.grid, gridStyle]}>
      {collageArtwork.slice(0, 4).map((artworkUrl, index) => (
        <AppImage
          key={`${artworkUrl}-${index}`}
          source={{ uri: artworkUrl }}
          style={imageStyle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureGrid: {
    gap: 4,
    height: 110,
    width: 110,
  },
  compactGrid: {
    gap: 2,
    height: 48,
    width: 48,
  },
  featureImage: {
    borderRadius: 8,
    height: 53,
    width: 53,
  },
  compactImage: {
    borderRadius: 4,
    height: 23,
    width: 23,
  },
});
