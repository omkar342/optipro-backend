import { Schema, model } from "mongoose";
import { IOrder } from '../interfaces/IOrder';  // Import IOrder interface

const orderSchema = new Schema<IOrder>({
  storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  aggregator: { type: String, required: true },
  items: { type: [String], required: true },
  netAmount: { type: Number, required: true },
  grossAmount: { type: Number, required: true },
  tax: { type: Number, required: true },
  discount: { type: Number, required: true },
  status: { type: String, enum: ['delivered', 'pending', 'cancelled'], required: true },
  deliveryTime: { type: Date, required: true },
  eventLog: { type: [String], required: true },
});

const Order = model<IOrder>('Order', orderSchema);

export default Order;
