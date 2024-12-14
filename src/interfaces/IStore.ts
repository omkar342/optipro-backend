export interface IStore {
  name: string;
  username: string;
  password: string;
  aggregators: string[]; // List of aggregators like Zomato, Swiggy, etc.
}
