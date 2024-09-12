export interface Person {
  id: string;
  hidden: boolean;
  state: string;
  name: string;
  first_name: string | null;
  birth: string | null;
  death: string | null;
  birth_place: string | null;
  death_place: string | null;
  death_cause: string | null;
  residence: string | null;
  comments: string;
  created_at: string;
  born_as: string | null;
  work: string | null;
  age: number | null;
  origin: string | null;
  grave_number: string | null;
  religion: string | null;
  insurance_doc_number: number | null;
  death_register_number: string | null;
  stay_time: number | null;
  work_start_bs: string | null;
  death_time: Date | null;
  marriage_status: string | null;
  children: number | null;
  burial_day: string | null;
}

export interface UnIdentifiedPerson {
  // TODO: Workaround because supabase uses id for insertion
  hidden: boolean;
  state: string;
  name: string;
  first_name: string | null;
  birth: string | null;
  death: string | null;
  birth_place: string | null;
  death_place: string | null;
  death_cause: string | null;
  residence: string | null;
  comments: string;
  born_as: string | null;
  work: string | null;
  age: number | null;
  origin: string | null;
  grave_number: string | null;
  religion: string | null;
  insurance_doc_number: number | null;
  death_register_number: string | null;
  stay_time: number | null;
  work_start_bs: string | null;
  death_time: Date | null;
  marriage_status: string | null;
  children: number | null;
  burial_day: string | null;
}