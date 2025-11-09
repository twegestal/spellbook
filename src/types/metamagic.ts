export type MetamagicOption = {
  id: string;
  idx: string;
  name: string;
  cost: number;
  description?: string;
  short?: string;
  can_stack?: boolean;
  tags?: string[];
};

export type KnownMetamagicRow = {
  idx?: string;
  option_id?: string;
  character_id?: string;
};
