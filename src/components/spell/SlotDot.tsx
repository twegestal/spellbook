import { UnstyledButton, useMantineTheme } from '@mantine/core';

export function SlotDot({
  isSpent,
  onClick,
  size = 18,
  disabled = false,
  ariaLabel,
  color,
}: {
  isSpent: boolean;
  onClick: () => void;
  size?: number;
  disabled?: boolean;
  ariaLabel?: string;
  color?: string;
}) {
  const theme = useMantineTheme();
  const border = theme.colors.dark[3];
  const defaultColor = theme.colors[theme.primaryColor][6];
  const dotColor = color ? (theme.colors[color]?.[6] ?? color) : defaultColor;

  return (
    <UnstyledButton
      aria-label={ariaLabel ?? 'Open slot picker'}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        background: isSpent ? dotColor : 'transparent',
        border: `1px solid ${isSpent ? dotColor : border}`,
        opacity: isSpent ? 1 : 0.9,
        transition: 'transform 80ms ease, box-shadow 80ms ease',
      }}
      onMouseDown={(e) => e.preventDefault()}
    />
  );
}
