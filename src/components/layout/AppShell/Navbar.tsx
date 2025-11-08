import { Divider, NavLink, ScrollArea } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  close: () => void;
};

export function NavBar({ close }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const go = (to: string) => () => {
    navigate(to);
    close();
  };

  return (
    <ScrollArea type="hover" style={{ height: '100%' }}>
      <NavLink
        label="Spells"
        active={isActive('/spells')}
        onClick={go('/spells')}
      />
      <NavLink
        label="Characters"
        active={isActive('/characters')}
        onClick={go('/characters')}
      />
      <NavLink
        label="Create character"
        active={isActive('/characters/new')}
        onClick={go('/characters/new')}
      />
      <Divider my="xs" />
      <NavLink
        label="Settings"
        active={isActive('/settings')}
        onClick={go('/settings')}
      />
    </ScrollArea>
  );
}
