export interface Person {
  id: string;
  hidden: boolean;
  state: string;
  name: string;
  birth: string | null;
  death: string | null;
  birth_place: string | null;
  death_place: string | null;
  death_cause: string | null;
  residence: string | null;
  comments: string;
  created_at: string;
}

export interface UnIdentifiedPerson {
  // TODO: Workaround because supabase uses id for insertion
  hidden: boolean;
  state: string;
  name: string;
  birth: string | null;
  death: string | null;
  birth_place: string | null;
  death_place: string | null;
  death_cause: string | null;
  residence: string | null;
  comments: string;
}