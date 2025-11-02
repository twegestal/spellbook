import { Group, UnstyledButton } from '@mantine/core';
import { Search, User, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
};

const ITEMS: Item[] = [
  { to: '/spells', label: 'Spells', icon: Search },
  { to: '/characters', label: 'Characters', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Group justify="space-around" px="md" py="xs">
      {ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);

        return (
          <UnstyledButton
            key={to}
            onClick={() => navigate(to)}
            aria-label={label}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            <Icon
              size={24}
              color={
                active
                  ? 'var(--mantine-primary-color-filled)'
                  : 'var(--mantine-color-dimmed)'
              }
            />
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
