import { useState, useCallback } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Divider,
  Drawer,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Button,
} from '@mantine/core';
import { Minus, Plus } from 'lucide-react';

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100] as const;
type DiceType = (typeof DICE_TYPES)[number];

type RollResult = {
  dice: number[];
  modifier: number;
  total: number;
  diceType: DiceType;
  diceCount: number;
};

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function DiceRoller({ opened, onClose }: Props) {
  const [diceType, setDiceType] = useState<DiceType>(20);
  const [diceCount, setDiceCount] = useState<number | string>(1);
  const [modifier, setModifier] = useState<number | string>(0);
  const [result, setResult] = useState<RollResult | null>(null);
  const [rolling, setRolling] = useState(false);

  const handleRoll = useCallback(() => {
    const count = Math.max(1, Math.min(20, Number(diceCount) || 1));
    const mod = Number(modifier) || 0;

    setRolling(true);
    setResult(null);

    // Animera rullningen
    let ticks = 0;
    const maxTicks = 8;
    const interval = setInterval(() => {
      ticks++;
      const fakeDice = Array.from({ length: count }, () => rollDie(diceType));
      const fakeTotal = fakeDice.reduce((s, d) => s + d, 0) + mod;
      setResult({
        dice: fakeDice,
        modifier: mod,
        total: fakeTotal,
        diceType,
        diceCount: count,
      });

      if (ticks >= maxTicks) {
        clearInterval(interval);
        // Slutresultat
        const finalDice = Array.from({ length: count }, () =>
          rollDie(diceType),
        );
        const finalTotal = finalDice.reduce((s, d) => s + d, 0) + mod;
        setResult({
          dice: finalDice,
          modifier: mod,
          total: finalTotal,
          diceType,
          diceCount: count,
        });
        setRolling(false);
      }
    }, 60);
  }, [diceType, diceCount, modifier]);

  const diceOptions = DICE_TYPES.map((d) => ({
    value: String(d),
    label: `d${d}`,
  }));

  const isNat20 =
    result &&
    diceType === 20 &&
    Number(diceCount) === 1 &&
    result.dice[0] === 20;
  const isNat1 =
    result &&
    diceType === 20 &&
    Number(diceCount) === 1 &&
    result.dice[0] === 1;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Dice roller"
      position="bottom"
      size="auto"
    >
      <Stack gap="lg" pb="md">
        {/* Dice picker */}
        <SimpleGrid cols={7} spacing="xs">
          {DICE_TYPES.map((d) => (
            <Button
              key={d}
              variant={diceType === d ? 'filled' : 'light'}
              color="violet"
              onClick={() => setDiceType(d)}
              size="sm"
              px={0}
            >
              d{d}
            </Button>
          ))}
        </SimpleGrid>

        {/* Count och modifier */}
        <Group grow gap="md">
          <NumberInput
            label="Number of dice"
            value={diceCount}
            min={1}
            max={20}
            onChange={setDiceCount}
          />
          <NumberInput
            label="Modifier"
            value={modifier}
            min={-20}
            max={20}
            prefix={Number(modifier) >= 0 ? '+' : ''}
            onChange={setModifier}
            allowNegative
          />
        </Group>

        {/* Roll-knapp */}
        <Button
          size="lg"
          color="violet"
          onClick={handleRoll}
          loading={rolling}
          fullWidth
        >
          Roll {diceCount}d{diceType}
          {Number(modifier) !== 0
            ? ` ${Number(modifier) >= 0 ? '+' : ''}${modifier}`
            : ''}
        </Button>

        {/* Resultat */}
        {result && (
          <>
            <Divider />
            <Stack gap="xs" align="center">
              <Text
                fz={64}
                fw={800}
                lh={1}
                c={isNat20 ? 'yellow' : isNat1 ? 'red' : undefined}
                style={{ transition: 'color 150ms ease' }}
              >
                {result.total}
              </Text>

              {isNat20 && (
                <Badge color="yellow" size="lg">
                  Natural 20! 🎉
                </Badge>
              )}
              {isNat1 && (
                <Badge color="red" size="lg">
                  Natural 1 💀
                </Badge>
              )}

              {result.dice.length > 1 && (
                <Group gap="xs" justify="center">
                  {result.dice.map((d, i) => (
                    <Badge key={i} variant="light" color="violet">
                      {d}
                    </Badge>
                  ))}
                  {result.modifier !== 0 && (
                    <Badge variant="light" color="gray">
                      {result.modifier >= 0 ? '+' : ''}
                      {result.modifier}
                    </Badge>
                  )}
                </Group>
              )}

              {result.dice.length === 1 && result.modifier !== 0 && (
                <Group gap="xs" justify="center">
                  <Badge variant="light" color="violet">
                    {result.dice[0]}
                  </Badge>
                  <Badge variant="light" color="gray">
                    {result.modifier >= 0 ? '+' : ''}
                    {result.modifier}
                  </Badge>
                </Group>
              )}
            </Stack>
          </>
        )}
      </Stack>
    </Drawer>
  );
}
