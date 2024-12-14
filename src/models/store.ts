import { Schema, model } from "mongoose";
import { IStore } from "../interfaces/IStore"; // Import IStore interface

const storeSchema = new Schema<IStore>({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  aggregators: { type: [String], required: true }, // Stores the aggregator names
});

const Store = model<IStore>("Store", storeSchema);

export default Store;
