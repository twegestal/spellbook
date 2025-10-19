import { Box, HStack, IconButton } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuSearch, LuUser, LuSettings } from 'react-icons/lu';
import { memo } from 'react';

type Tab = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
  testId?: string;
};

const tabs: Tab[] = [
  { to: '/spells', label: 'Search', Icon: LuSearch, testId: 'tab-search' },
  {
    to: '/characters',
    label: 'Characters',
    Icon: LuUser,
    testId: 'tab-characters',
  },
  {
    to: '/settings',
    label: 'Settings',
    Icon: LuSettings,
    testId: 'tab-settings',
  },
];

export const BottomNav = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Box
      as="nav"
      position="sticky"
      bottom="0"
      bg="bg"
      borderTopWidth="1px"
      borderColor="border"
      boxShadow="sm"
      px={3}
      py={2}
      zIndex="docked"
      pb={`calc(0.5rem + env(safe-area-inset-bottom))`}
    >
      <HStack justify="space-between" maxW="container.sm" mx="auto" gap={1}>
        {tabs.map(({ to, label, Icon }) => {
          const active = isActive(to);
          return (
            <Box key={to} flex="1" display="grid" placeItems="center">
              <IconButton
                aria-label={label}
                onClick={() => navigate(to)}
                variant="ghost"
                _hover={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
                color={active ? 'purple.400' : 'fg.muted'}
                size="lg"
                rounded="xl"
              >
                <Icon size={22} />
              </IconButton>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
});
