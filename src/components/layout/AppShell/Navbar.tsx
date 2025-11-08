import { Divider, NavLink, ScrollArea } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Settings, SquarePlus, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../../../context/auth';

type Props = {
  close: () => void;
};

export function NavBar({ close }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const go = (to: string) => () => {
    navigate(to);
    close();
  };

  return (
    <ScrollArea type="hover" style={{ height: '100%' }}>
      <NavLink
        label="Spells"
        leftSection={<BookOpen size={18} />}
        active={isActive('/spells')}
        onClick={go('/spells')}
      />
      <NavLink
        label="Characters"
        leftSection={<Users size={18} />}
        active={isActive('/characters')}
        onClick={go('/characters')}
      />
      <NavLink
        label="Create character"
        leftSection={<SquarePlus size={18} />}
        active={isActive('/characters/new')}
        onClick={go('/characters/new')}
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
