export type CharacterResource = {
  id: string;
  character_id: string;
  key: string;
  current: number;
  maximum: number;
  resets_on: 'long' | 'short';
  created_at: string;
  updated_at: string;
};
