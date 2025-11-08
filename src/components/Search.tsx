import {
  ActionIcon,
  Button,
  Overlay,
  Paper,
  TextInput,
  Transition,
  rem,
} from '@mantine/core';
import { useDisclosure, useFocusTrap, useClickOutside } from '@mantine/hooks';
import { Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  placeholder?: string;
  onSearch?: (value: string) => void;
  zIndex?: number;
};

export function FloatingSearch({
  placeholder = 'Search',
  onSearch,
  zIndex = 400,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const focusTrapRef = useFocusTrap(opened);
  const paperRef = useClickOutside<HTMLDivElement>(() => close());

  useEffect(() => {
    if (opened) inputRef.current?.focus();
  }, [opened]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(value.trim());
  };

  const height = 56;
  const radius = 28;

  return (
    <>
      {/* Blur overlay */}
      <Overlay
        zIndex={zIndex}
        opacity={0.6}
        blur={8}
        color="#000"
        onClick={close}
        style={{
          pointerEvents: opened ? 'auto' : 'none',
          transition: 'opacity 180ms ease',
          opacity: opened ? 1 : 0,
        }}
      />

      <div
        style={{
          position: 'fixed',
          right: rem(16),
          bottom: `calc(env(safe-area-inset-bottom, 0px) + ${rem(16)})`,
          zIndex: zIndex + 1,
        }}
      >
        {!opened && (
          <ActionIcon
            onClick={open}
            size={rem(height)}
            radius="xl"
            variant="filled"
            aria-label="Open search"
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,.35)',
            }}
          >
            <Search size={22} />
          </ActionIcon>
        )}

        <Transition
          mounted={opened}
          transition="pop-bottom-right"
          duration={180}
          timingFunction="cubic-bezier(.2,.7,.2,1)"
        >
          {(styles) => (
            <Paper
              ref={(node) => {
                (paperRef as any).current = node;
                (focusTrapRef as any).current = node;
              }}
              withBorder={false}
              radius={radius}
              p={0}
              component="form"
              onSubmit={submit}
              style={{
                ...styles,
                height: rem(height),
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                boxShadow: '0 12px 32px rgba(0,0,0,.35)',

                width: rem(height),
                overflow: 'hidden',
                transition:
                  'width 220ms cubic-bezier(.2,.7,.2,1), transform 220ms cubic-bezier(.2,.7,.2,1), opacity 160ms ease',
                ...(opened && {
                  width: `min(680px, calc(100vw - ${rem(32)}))`,
                }),
              }}
            >
              <TextInput
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                placeholder={placeholder}
                radius={radius}
                variant="unstyled"
                leftSection={<Search size={20} />}
                leftSectionPointerEvents="none"
                styles={{
                  input: {
                    height: rem(height),
                    paddingLeft: rem(14),
                    paddingRight: rem(8),
                    fontSize: rem(16),
                  },
                }}
              />

              <Button
                variant="subtle"
                color="gray"
                px="sm"
                onClick={() => {
                  setValue('');
                  close();
                }}
              >
                Cancel
              </Button>
            </Paper>
          )}
        </Transition>
      </div>
    </>
  );
}
