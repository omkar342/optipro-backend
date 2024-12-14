import mongoose from "mongoose";

export interface IOrder {
  storeId: mongoose.Types.ObjectId; // Reference to the store
  aggregator: string; // Aggregator name (e.g., Zomato, Swiggy)
  items: string[]; // List of items in the order
  netAmount: number; // Net amount for the order
  grossAmount: number; // Gross amount for the order
  tax: number; // Tax for the order
  discount: number; // Discount applied to the order
  status: string; // Status of the order (e.g., "delivered", "pending")
  deliveryTime: Date; // Timestamp when the order was delivered
  eventLog: string[];
}
