import { UnstyledButton, useMantineTheme } from '@mantine/core';

export function SlotDot({
  isSpent,
  onClick,
  size = 18,
  disabled = false,
}: {
  isSpent: boolean;
  onClick: () => void;
  size?: number;
  disabled?: boolean;
}) {
  const theme = useMantineTheme();
  const border = theme.colors.dark[3];
  const main = theme.colors[theme.primaryColor][6];

  return (
    <UnstyledButton
      aria-label="Open slot picker"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        background: isSpent ? main : 'transparent',
        border: `1px solid ${border}`,
        opacity: isSpent ? 1 : 0.9,
        transition: 'transform 80ms ease, box-shadow 80ms ease',
      }}
      onMouseDown={(e) => e.preventDefault()}
    />
  );
}
