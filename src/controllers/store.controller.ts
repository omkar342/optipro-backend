import express, { Request, Response } from "express";
import Store from "../models/store";
import bcrypt from "bcrypt";

const router = express.Router();

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
  
      return res.status(200).json({ message: "Store updated successfully", store: updatedStore });
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
