import express, { Request, Response } from "express";
import Order from "../models/order";

const router = express.Router();

// API to store orders in the database
router.post("/bulk-create", async (req: Request, res: any) => {
  const ordersData = req.body; // Expecting an array of order objects

  if (!Array.isArray(ordersData) || ordersData.length === 0) {
    return res.status(400).json({
      error: "Invalid data format. Please provide an array of orders.",
    });
  }

  try {
    // Validate each order before saving (you can extend this with more validation logic)
    const validOrders = ordersData.map((order: any) => ({
      storeId: order.storeId,
      aggregator: order.aggregator,
      items: order.items,
      netAmount: order.netAmount,
      grossAmount: order.grossAmount,
      tax: order.tax,
      discount: order.discount,
      status: order.status,
      deliveryTime: order.deliveryTime,
      eventLog: order.eventLog,
    }));

    const createdOrders = await Order.insertMany(validOrders);

    return res.status(201).json({
      message: `${createdOrders.length} orders created successfully.`,
      orders: createdOrders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create orders", message: error });
  }
});

export default router;
