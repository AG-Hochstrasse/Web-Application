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
  exhumed: boolean;
  exhumation_date: string | null;
  auto_added: boolean;
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
  exhumed: boolean;
  exhumation_date: string | null;
  auto_added: boolean;
}

export interface User {
  id: string
  created_at: Date
  username: string | null
  user: string // assigned supabase auth user
  read_write: number
  create_news: boolean
  maintainer: boolean
  admin: boolean
  developer: boolean
  conflict_read_write: number
}


export enum ConflictType {
  "conflict",
  "not_confirmed",
  "improvememt",
  "confirmed"
}

export interface Conflict {
  id: number;
  created_at: string;
  created_by: number
  created_by_name: string
  person: number;
  field: string; //TODO: create enum type
  comment: string | null;
  type: "conflict" | "not_confirmed" | "improvement" | "confirmed";
  open: boolean;
}

export interface UnidentifiedConflict {
  person: number;
  created_by: number
  created_by_name: string
  field: string; //TODO: create enum type
  comment: string | null;
  type: "conflict" | "not_confirmed" | "improvement" | "confirmed";
  open: boolean;
}

export interface Activity {
  id: number
  created_at: string
  by: string
  type: string
  comment: string
  object: number
  object_type: string
  by_name: string
}

export interface UnidentifiedActivity {
  by: string
  type: string
  comment: string
  object: number
  object_type: string
  by_name: string
}

export enum ActivityType {
  "person_comment",
  "person_closed",
  "person_published",
  "person_reopened",
  "person_closed_notplanned",
  "person_hidden",
  "conflict_closed",
  "conflict_reopened",
  "conflict_comment"
}

export enum ActivityObjectType {
  "person",
  "conflict"
}

export const conflictablePersonFields = [
  "name",
  "first_name",
  "birth",
  "death",
  "birth_place",
  "death_place",
  "death_cause",
  "residence",
  "born_as",
  "work",
  "age",
  "origin",
  "grave_number",
  "religion",
  "insurance_doc_number",
  "death_register_number",
  "stay_time",
  "work_start_bs",
  "death_time",
  "marriage_status",
  "children",
  "burial_day",
  "exhumed",
  "exhumation_date",
  "comments"
]

export const displayedPersonFields = [
  "name",
  "first_name",
  "birth",
  "death",
  "birth_place",
  "death_place",
  "death_cause",
  "residence",
  "born_as",
  "work",
  "age",
  "origin",
  "grave_number",
  "religion",
  "insurance_doc_number",
  "death_register_number",
  "stay_time",
  "work_start_bs",
  "death_time",
  "marriage_status",
  "children",
  "burial_day",
  "exhumation_date",
  "comments"
]

export interface Link {
  id: number
  created_at: Date
  url: string
  name: string
  person: number
}