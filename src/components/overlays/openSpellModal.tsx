import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { modals } from '@mantine/modals';
import { Badge, Button, Divider, Group, Stack, Text } from '@mantine/core';
import type { Spell } from '../../types/spells';
import { DAMAGE_TYPE_COLORS } from '../../util/damageColors';

function SpellDetails({
  spell,
  onClose,
}: {
  spell: Spell;
  onClose: () => void;
}) {
  const levelLabel = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
  function normalizeMarkdownTables(source: string) {
    return source
      .replace(/^\s+\|/gm, '|')
      .replace(/\n[ \t]*\n(?=\|)/g, '\n')
      .replace(/(\|[-:| ]+\|)\n{2,}/g, '$1\n');
  }

  const raw = Array.isArray(spell.description)
    ? spell.description.join('\n\n')
    : spell.description ?? '';

  const markdown = normalizeMarkdownTables(raw);

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Badge variant="light">{levelLabel}</Badge>
        {spell.school_name && (
          <Badge variant="light" color="teal">
            {spell.school_name}
          </Badge>
        )}
        {spell.ritual && (
          <Badge variant="light" color="cyan">
            Ritual
          </Badge>
        )}
        {spell.concentration && (
          <Badge variant="light" color="red">
            Concentration
          </Badge>
        )}
      </Group>

      {spell.class_names?.length ? (
        <Text c="dimmed" fz="sm">
          Classes: {spell.class_names.map((c) => c ?? c).join(', ')}
        </Text>
      ) : null}

      {spell.casting_time && (
        <Text fz="sm">
          <Text span fw={600}>
            Casting time:
          </Text>{' '}
          {spell.casting_time}
        </Text>
      )}

      {spell.range && (
        <Text fz="sm">
          <Text span fw={600}>
            Range:
          </Text>{' '}
          {spell.range}
        </Text>
      )}

      {spell.duration && (
        <Text fz="sm">
          <Text span fw={600}>
            Duration:
          </Text>{' '}
          {spell.duration}
        </Text>
      )}

      {spell.dc_type && (
        <Text fz="sm">
          <Text span fw={800}>
            Saving throw:
          </Text>{' '}
          {spell.dc_type}
        </Text>
      )}

      {spell.components?.length ? (
        <Text fz="sm">
          <Text span fw={600}>
            Components:
          </Text>{' '}
          {spell.components.join(', ')}
          {spell.material ? (
            <Text span c="dimmed">
              {' — '}
              {spell.material}
            </Text>
          ) : null}
        </Text>
      ) : null}

      {spell.damage_type_name && (
        <Group gap="xs" align="center">
          <Text fz="sm" fw={800}>
            Damage type:
          </Text>
          <Badge
            variant="light"
            color={
              DAMAGE_TYPE_COLORS[spell.damage_type_name.toLowerCase()] ?? 'gray'
            }
          >
            {spell.damage_type_name}
          </Badge>
        </Group>
      )}

      {markdown && (
        <Stack gap="sm" mt="sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5em' }}>
                  {children}
                </p>
              ),
              table: ({ children }) => (
                <div style={{ overflowX: 'auto', marginTop: '0.5em' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th
                  style={{
                    borderBottom: '1px solid #ccc',
                    textAlign: 'left',
                    padding: '4px 6px',
                  }}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  style={{ borderBottom: '1px solid #eee', padding: '4px 6px' }}
                >
                  {children}
                </td>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </Stack>
      )}

      {spell.higher_level?.length ? (
        <Stack gap={4} mt="sm">
          <Text fw={600} fz="sm">
            At higher levels
          </Text>
          {spell.higher_level.map((p, i) => (
            <Text key={i} fz="sm">
              {p}
            </Text>
          ))}
        </Stack>
      ) : null}

      <Divider my="sm" />
      <Group justify="flex-end">
        <Button variant="light" onClick={onClose}>
          Close
        </Button>
      </Group>
    </Stack>
  );
}

export function openSpellModal(spell: Spell) {
  const id = modals.open({
    size: 'lg',
    withCloseButton: true,
    centered: true,
    title: spell.name,
    children: <SpellDetails spell={spell} onClose={() => modals.close(id)} />,
  });
}
