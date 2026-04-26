import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Badge,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { CreateSpell } from '../../types/spells';
import type { MetaItem } from '../../types/meta';
import { DAMAGE_TYPE_COLORS } from '../../util/damageColors';

type Props = {
  values: CreateSpell;
  schools: MetaItem[];
  damageTypes: MetaItem[];
  spellClasses: MetaItem[];
};

function normalizeMarkdownTables(source: string) {
  return source
    .replace(/^\s+\|/gm, '|')
    .replace(/\n[ \t]*\n(?=\|)/g, '\n')
    .replace(/(\|[-:| ]+\|)\n{2,}/g, '$1\n');
}

export function SpellPreview({
  values,
  schools,
  damageTypes,
  spellClasses,
}: Props) {
  const levelLabel = values.level === 0 ? 'Cantrip' : `Level ${values.level}`;
  const school = schools.find((s) => Number(s.id) === values.school_id);
  const damageType = damageTypes.find(
    (d) => Number(d.id) === values.damage_type_id,
  );
  const selectedClasses = spellClasses
    .filter((c) => (values.class_ids ?? []).includes(Number(c.id)))
    .map((c) => c.name);

  const markdown = normalizeMarkdownTables(values.description.join('\n\n'));

  return (
    <Paper withBorder p="md" h="100%">
      <ScrollArea h="100%">
        <Stack gap="sm">
          <Title order={4}>{values.name || 'Unnamed spell'}</Title>

          <Group gap="xs">
            <Badge variant="light">{levelLabel}</Badge>
            {school && (
              <Badge variant="light" color="teal">
                {school.name}
              </Badge>
            )}
            {values.ritual && (
              <Badge variant="light" color="cyan">
                Ritual
              </Badge>
            )}
            {values.concentration && (
              <Badge variant="light" color="red">
                Concentration
              </Badge>
            )}
          </Group>

          {selectedClasses.length > 0 && (
            <Text c="dimmed" fz="sm">
              Classes: {selectedClasses.join(', ')}
            </Text>
          )}

          {values.casting_time && (
            <Text fz="sm">
              <Text span fw={600}>
                Casting time:
              </Text>{' '}
              {values.casting_time}
            </Text>
          )}
          {values.range && (
            <Text fz="sm">
              <Text span fw={600}>
                Range:
              </Text>{' '}
              {values.range}
            </Text>
          )}
          {values.duration && (
            <Text fz="sm">
              <Text span fw={600}>
                Duration:
              </Text>{' '}
              {values.duration}
            </Text>
          )}

          {values.components?.length ? (
            <Text fz="sm">
              <Text span fw={600}>
                Components:
              </Text>{' '}
              {values.components.join(', ')}
              {values.material && (
                <Text span c="dimmed">
                  {' '}
                  — {values.material}
                </Text>
              )}
            </Text>
          ) : null}

          {values.dc_type && (
            <Text fz="sm">
              <Text span fw={600}>
                Saving throw:
              </Text>{' '}
              {values.dc_type.toUpperCase()}
              {values.dc_success && ` (${values.dc_success})`}
            </Text>
          )}

          {values.aoe_type && (
            <Text fz="sm">
              <Text span fw={600}>
                Area of effect:
              </Text>{' '}
              {values.aoe_size ? `${values.aoe_size}-foot ` : ''}
              {values.aoe_type}
            </Text>
          )}

          {damageType && (
            <Group gap="xs" align="center">
              <Text fz="sm" fw={600}>
                Damage type:
              </Text>
              <Badge
                variant="light"
                color={
                  DAMAGE_TYPE_COLORS[damageType.name.toLowerCase()] ?? 'gray'
                }
              >
                {damageType.name}
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
                      <table
                        style={{ width: '100%', borderCollapse: 'collapse' }}
                      >
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
                      style={{
                        borderBottom: '1px solid #eee',
                        padding: '4px 6px',
                      }}
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

          {values.higher_level?.length ? (
            <Stack gap={4} mt="sm">
              <Text fw={600} fz="sm">
                At higher levels
              </Text>
              {values.higher_level.map((p, i) => (
                <Text key={i} fz="sm">
                  {p}
                </Text>
              ))}
            </Stack>
          ) : null}

          <Divider my="sm" />
          <Text fz="xs" c="dimmed">
            Homebrew — preview
          </Text>
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
