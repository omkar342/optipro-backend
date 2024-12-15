import express, { Request, Response } from "express";
import Store from "../models/store";
import Order from "../models/order";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  verifyAccessToken,
} from "../middlewares/jwt.controller";

const router = express.Router();

// API to login a store
router.post("/store-login", async (req: Request, res: any) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const store = await Store.findOne({ username: userName });

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (await bcrypt.compare(password, store.password)) {
      const accessToken = generateAccessToken(store._id);
      return res.status(200).json({ accessToken });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/verify-access-token", verifyAccessToken, async (req: Request, res: any) => {
  if (req.storeId !== undefined) {
    const storeData = await Store.findById(req.storeId) as any;
    // Convert the Mongoose document to a plain JavaScript object
    const plainStoreData = storeData.toObject();
    return res.status(200).json({
      message: "Access token is valid",
      storeData: plainStoreData,
    });
  }
});


// API to get store details by storeId
router.get(
  "/store-details",
  verifyAccessToken,
  async (req: Request, res: any) => {
    try {
      const store = await Store.findById(req.storeId);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      const ordersAssociated = await Order.find({ storeId: req.storeId });
      return res.status(200).json({ store, ordersAssociated });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch store details" });
    }
  }
);

// API to create a new store
router.post("/create-store", async (req: Request, res: any) => {
  const { name, username, password, aggregators } = req.body;

  if (!name || !username || !password || !aggregators) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newStore = new Store({
      name,
      username,
      password: hashedPassword,
      aggregators,
    });
    await newStore.save();
    return res.status(201).json({ message: "Store created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create store" });
  }
});

// API to update a store
router.post("/edit-store", async (req: Request, res: any) => {
  const { storeId, name, username, password, aggregators } = req.body;

  if (!name || !username || !password || !aggregators) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updatedStore = await Store.findByIdAndUpdate(
      storeId,
      { name, username, password: hashedPassword, aggregators },
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }

    return res
      .status(200)
      .json({ message: "Store updated successfully", store: updatedStore });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update store" });
  }
});

// API to get all stores
router.get("/all-stores", async (req: Request, res: any) => {
  try {
    const stores = await Store.find();
    return res.status(200).json({ stores });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stores" });
  }
});

export default router;
