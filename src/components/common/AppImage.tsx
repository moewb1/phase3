import React from 'react';
import FastImage, { type FastImageProps } from '@d11/react-native-fast-image';
import type { ImageRequireSource, ImageSourcePropType } from 'react-native';

type AppImageSource = FastImageProps['source'] | ImageSourcePropType;
type AppImageCache = NonNullable<FastImageProps['source']> extends infer SourceType
  ? SourceType extends { cache?: infer CacheType }
    ? CacheType
    : never
  : never;
type AppImagePriority = NonNullable<FastImageProps['source']> extends infer SourceType
  ? SourceType extends { priority?: infer PriorityType }
    ? PriorityType
    : never
  : never;

interface AppImageProps extends Omit<FastImageProps, 'source'> {
  source?: AppImageSource;
}

function isAppImageCache(value: unknown): value is AppImageCache {
  return value === 'immutable' || value === 'web' || value === 'cacheOnly';
}

function isAppImagePriority(value: unknown): value is AppImagePriority {
  return value === 'low' || value === 'normal' || value === 'high';
}

function resolveSource(
  source: AppImageSource | undefined,
): FastImageProps['source'] | undefined {
  if (!source) {
    return undefined;
  }

  if (Array.isArray(source)) {
    return resolveSource(source[0]);
  }

  if (typeof source === 'number') {
    return source;
  }

  if ('uri' in source) {
    const uri = source.uri?.trim();
    const priority = 'priority' in source ? source.priority : undefined;

    if (!uri) {
      return undefined;
    }

    return {
      cache: isAppImageCache(source.cache)
        ? source.cache
        : FastImage.cacheControl.immutable,
      headers: source.headers,
      priority: isAppImagePriority(priority) ? priority : FastImage.priority.normal,
      uri,
    };
  }

  return source as ImageRequireSource;
}

export function AppImage({
  source,
  transition = FastImage.transition.fade,
  ...props
}: AppImageProps): React.JSX.Element {
  return (
    <FastImage
      {...props}
      source={resolveSource(source)}
      transition={transition}
    />
  );
}
