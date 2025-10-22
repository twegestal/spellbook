import ky from 'ky';

export const slotsApi = (apiClient: typeof ky) => ({
  getSpellSlots: (characterId: string) =>
    apiClient.get(`slots/${characterId}/slots`).json<
      | {
          type: 'prepared';
          levels: { slotLevel: number; remaining: number; maximum: number }[];
        }
      | {
          type: 'pact';
          slotLevel: number;
          remaining: number;
          maximum: number;
        }
    >(),

  toggleSpellSlot: (body: {
    characterId: string;
    slotLevel: number;
    slotIndex: number;
    spellId?: string;
    note?: string;
  }) =>
    apiClient
      .post(`slots/${body.characterId}/slots/toggle`, {
        json: {
          slotLevel: body.slotLevel,
          slotIndex: body.slotIndex,
          spellId: body.spellId ?? null,
          note: body.note ?? null,
        },
      })
      .json<{
        characterId: string;
        slotLevel: number;
        slotIndex: number;
        spent: boolean;
      }>(),
});
