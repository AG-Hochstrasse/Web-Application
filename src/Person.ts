export interface Person {
  id: string;
  hidden: boolean;
  state: string;
  name: string;
  birth: string; // or Date if it's already in date format
  death: string; // or Date if it's already in date format
}