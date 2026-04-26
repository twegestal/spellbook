import {
  Avatar,
  Divider,
  NavLink,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, Users, BookOpen, Wand2 } from 'lucide-react';
import { useAuth } from '../../../context/auth';

type Props = {
  close: () => void;
};

export function NavBar({ close }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const go = (to: string) => () => {
    navigate(to);
    close();
  };

  const displayName =
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email;
  const avatarUrl =
    user?.user_metadata?.picture ?? user?.user_metadata?.avatar_url;
  const email = user?.email;

  return (
    <ScrollArea type="hover" style={{ height: '100%' }}>
      <Stack gap={4} px="sm" py="md">
        <Avatar src={avatarUrl} radius="xl" size="md" />
        <Text size="sm" fw={600} truncate>
          {displayName}
        </Text>
        <Text size="xs" c="dimmed" truncate>
          {email}
        </Text>
      </Stack>

      <Divider mb="xs" />

      <NavLink
        label="Spells"
        leftSection={<BookOpen size={18} />}
        active={isActive('/spells')}
        onClick={go('/spells')}
      />
      <NavLink
        label="Homebrew"
        leftSection={<Wand2 size={18} />}
        active={isActive('/spells/homebrew')}
        onClick={go('/spells/homebrew')}
      />
      <NavLink
        label="Characters"
        leftSection={<Users size={18} />}
        active={isActive('/characters')}
        onClick={go('/characters')}
      />

      <Divider my="xs" />

      <NavLink
        label="Settings"
        leftSection={<Settings size={18} />}
        active={isActive('/settings')}
        onClick={go('/settings')}
      />

      <Divider my="xs" />

      <NavLink
        label="Logout"
        leftSection={<LogOut size={18} />}
        onClick={() => logout()}
      />
    </ScrollArea>
  );
}
