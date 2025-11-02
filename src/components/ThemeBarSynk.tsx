import { useComputedColorScheme } from '@mantine/core';
import { useEffect } from 'react';

export function ThemeBarSync() {
  const scheme = useComputedColorScheme('light');

  useEffect(() => {
    const root = document.documentElement;

    let bodyColor = getComputedStyle(root)
      .getPropertyValue('--mantine-color-body')
      .trim();
    if (!bodyColor) bodyColor = scheme === 'dark' ? '#242424' : '#ffffff';

    let themeMeta = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement | null;
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', bodyColor);

    let iosMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    ) as HTMLMetaElement | null;
    if (!iosMeta) {
      iosMeta = document.createElement('meta');
      iosMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(iosMeta);
    }
    iosMeta.setAttribute('content', 'black-translucent');
  }, [scheme]);

  return null;
}
