import express from "express";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync("./src/data/locations.json", "utf-8");
    const locations = JSON.parse(data);
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load locations" });
  }
});

export default router;
