export type InvocationOption = {
  id: string;
  idx: string;
  name: string;
  prerequisite_level: number;
  prerequisite_pact: string | null;
  short: string | null;
  description: string | null;
  tags: string[];
};

export type KnownInvocationRow = {
  character_id: string;
  invocation_id: string;
  invocation_idx: string;
  name: string;
  prerequisite_level: number;
  prerequisite_pact: string | null;
  short: string | null;
  description: string | null;
  tags: string[];
  acquired_at: string;
};
