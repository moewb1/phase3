type PlaceholderQueryValue = string | number | boolean | null | undefined;

export function buildPlaceholderPath(
  pathname: string,
  query: Record<string, PlaceholderQueryValue> = {},
): string {
  const queryEntries = Object.entries(query).filter(([, value]) => {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  });

  if (queryEntries.length === 0) {
    return pathname;
  }

  const queryString = queryEntries
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join('&');

  return `${pathname}?${queryString}`;
}
