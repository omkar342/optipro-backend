import express, { Request, Response } from "express";
import Order from "../models/order";
import Store from "../models/store";
import moment from "moment";

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

// API to get order details of a particular store
router.get("/get-orders", async (req: Request, res: any) => {
  const { storeId } = req.body;

  try {
    const orders = await Order.find({ storeId });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// API to set the status of an order to delivered and also change its delivery time to current time using moment
router.put("/order-status-delivered", async (req: Request, res: any) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: "delivered",
        deliveryTime: moment().toISOString(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Order status changed successfully!", order });
  } catch (error) {
    return res.status(500).json({ error: "Failed to deliver order" });
  }
});

// API for every store to get the latest delivered order time for each aggregator
router.get("/latest-delivered-order-time", async (req: Request, res: any) => {
    try {
      const stores = await Store.find();
  
      const storeAggregatorData = [];
  
      for (const store of stores) {
        const storeData = { 
          storeName: store.name, 
          aggregators: [] as { aggregator: string; elapsedTime: string }[],
          storeId : store._id,
        };
  
        for (const aggregator of store.aggregators) {
          const lastDeliveredOrder = await Order.findOne({
            storeId: storeData.storeId,
            aggregator,
            status: "delivered",
          }).sort({ deliveryTime: -1 });
  
          if (lastDeliveredOrder) {
            storeData.aggregators.push({
              aggregator,
              elapsedTime: moment(lastDeliveredOrder.deliveryTime).fromNow(),
            });
          } else {
            storeData.aggregators.push({
              aggregator,
              elapsedTime: "No orders",
            });
          }
        }
  
        storeAggregatorData.push(storeData);
      }
  
      return res.status(200).json({ storeAggregatorData });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }
  });
  

export default router;
