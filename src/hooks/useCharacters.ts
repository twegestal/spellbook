import { useAuthedQuery } from './useAuthedQuery';
import { useApi } from './useApi';
import type {
  Character,
  CharacterListResponse,
  CreateCharacterInput,
} from '../types/character';
import { useAuthedMutation } from './useAuthedMutation';
import type { Spell, SpellListResponse } from '../types/spells';
import { useQueryClient } from '@tanstack/react-query';

export const useCharacters = () => {
  const listCharacters = useApi('listCharacters');
  return useAuthedQuery<CharacterListResponse, unknown, Character[]>({
    queryKey: ['characters'],
    queryFn: listCharacters,
    select: (data) => data.results,
  });
};

export const useCreateCharacter = () => {
  const createCharacter = useApi('createCharacter');
  return useAuthedMutation<Character, unknown, CreateCharacterInput>({
    mutationFn: createCharacter,
    invalidateKeys: [['characters']],
  });
};

export const useAddKnownSpell = () => {
  const addKnownSpell = useApi('addKnownSpell');
  const qc = useQueryClient();
  return useAuthedMutation<
    { character_id: string; spell_id: string; added_at: string },
    unknown,
    { characterId: string; spellId: string }
  >({
    mutationFn: addKnownSpell,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ['characters', vars.characterId, 'known-spells'],
      });
    },
  });
};

export const useRemoveKnownSpell = () => {
  const removeKnownSpell = useApi('removeKnownSpell');
  const qc = useQueryClient();
  return useAuthedMutation<
    { ok: true },
    unknown,
    { characterId: string; spellId: string }
  >({
    mutationFn: ({ characterId, spellId }) =>
      removeKnownSpell(characterId, spellId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ['characters', vars.characterId, 'known-spells'],
      });
    },
  });
};

export const useCharacterKnownSpells = (characterId: string) => {
  const getKnownSpells = useApi('getKnownSpells');
  return useAuthedQuery<SpellListResponse, unknown, Spell[]>({
    queryKey: ['characters', characterId, 'known-spells'],
    queryFn: () => getKnownSpells(characterId),
    enabled: !!characterId,
    select: (d) => d.results,
  });
};

export const useCharacterPreparedSpells = (characterId: string) => {
  const getPreparedSpells = useApi('getPreparedSpells');
  return useAuthedQuery<Spell[], unknown, Spell[]>({
    queryKey: ['characters', characterId, 'prepared-spells'],
    enabled: !!characterId,
    queryFn: async () => {
      const res = await getPreparedSpells(characterId);
      return res.results;
    },
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useAddPreparedSpell = () => {
  const addPreparedSpell = useApi('addPreparedSpell');
  const qc = useQueryClient();

  return useAuthedMutation<
    { character_id: string; spell_id: string; prepared_at: string },
    unknown,
    { characterId: string; spellId: string; spell: Spell },
    { prev: Spell[] }
  >({
    mutationFn: ({ characterId, spellId }) =>
      addPreparedSpell({ characterId, spellId }),

    onMutate: async ({ characterId, spellId, spell }) => {
      const key = ['characters', characterId, 'prepared-spells'] as const;
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<Spell[]>(key) ?? [];
      const exists = prev.some((s) => String(s.id) === String(spellId));
      if (!exists) qc.setQueryData<Spell[]>(key, [...prev, spell]);

      return { prev };
    },

    onError: (_err, { characterId }, ctx) => {
      const key = ['characters', characterId, 'prepared-spells'] as const;
      qc.setQueryData<Spell[]>(key, ctx?.prev ?? []);
    },
  });
};

export const useRemovePreparedSpell = () => {
  const removePreparedSpell = useApi('removePreparedSpell');
  const qc = useQueryClient();

  return useAuthedMutation<
    { ok: true },
    unknown,
    { characterId: string; spellId: string },
    { prev: Spell[] }
  >({
    mutationFn: ({ characterId, spellId }) =>
      removePreparedSpell(characterId, spellId),

    onMutate: async ({ characterId, spellId }) => {
      const key = ['characters', characterId, 'prepared-spells'] as const;
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<Spell[]>(key) ?? [];
      qc.setQueryData<Spell[]>(
        key,
        prev.filter((s) => String(s.id) !== String(spellId))
      );

      return { prev };
    },

    onError: (_err, { characterId }, ctx) => {
      const key = ['characters', characterId, 'prepared-spells'] as const;
      qc.setQueryData<Spell[]>(key, ctx?.prev ?? []);
    },
  });
};
