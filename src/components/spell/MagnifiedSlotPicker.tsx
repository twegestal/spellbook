import { useEffect } from 'react';
import { Box, HStack, IconButton, Portal, Text } from '@chakra-ui/react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  characterId: string;
  onToggle: (slotIndex: number) => void;
  onClose: () => void;
  isOpen: boolean;
  levelLabel: string;
  maximum: number;
  spent: number;
};

export function MagnifiedSlotPicker({
  characterId,
  onToggle,
  onClose,
  isOpen,
  levelLabel,
  maximum,
  spent,
}: Props) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 1000,
            }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Pick ${levelLabel} slot`}
            initial={{ y: '100%', opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
            }}
          >
            <Box
              bg="gray.900"
              color="gray.100"
              borderTopRadius="2xl"
              borderTopWidth="1px"
              borderColor="whiteAlpha.200"
              p={4}
              boxShadow="dark-lg"
            >
              <HStack justify="space-between" mb={3}>
                <Text fontWeight="semibold">{levelLabel}</Text>
                <IconButton
                  aria-label="Close"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  color="whiteAlpha.800"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  _active={{ bg: 'whiteAlpha.300' }}
                >
                  <X size={18} />
                </IconButton>
              </HStack>

              <HStack justify="center" gap={3} py={3}>
                {Array.from({ length: maximum }, (_, i) => {
                  const index = i + 1;
                  const isSpent = i < spent;
                  return (
                    <Box
                      key={i}
                      as="button"
                      aria-label={`Toggle slot ${index}`}
                      onClick={() => {
                        onToggle(index);
                        onClose();
                      }}
                      w="44px"
                      h="44px"
                      borderRadius="full"
                      borderWidth="2px"
                      borderColor="purple.800"
                      bg={isSpent ? 'purple.800' : 'transparent'}
                      opacity={isSpent ? 0.95 : 0.8}
                      boxShadow={
                        isSpent
                          ? '0 0 0 2px rgba(255,255,255,0.15) inset'
                          : 'none'
                      }
                      _hover={{
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.25)',
                      }}
                      _active={{
                        transform: 'scale(0.96)',
                        boxShadow: '0 0 0 3px rgba(255,255,255,0.25)',
                      }}
                    />
                  );
                })}
              </HStack>
            </Box>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
