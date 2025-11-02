import { useComputedColorScheme } from '@mantine/core';
import { useEffect } from 'react';

export function ThemeColorMeta() {
  const scheme = useComputedColorScheme('light');

  useEffect(() => {
    const root = document.documentElement;
    let color = getComputedStyle(root)
      .getPropertyValue('--mantine-color-body')
      .trim();

    if (!color) {
      color = scheme === 'dark' ? '#121212' : '#ffffff';
    }

    let meta = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  }, [scheme]);

  return null;
}
