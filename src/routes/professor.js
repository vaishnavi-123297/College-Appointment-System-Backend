const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Slot = require("../models/Slot");

// Add slot
router.post("/slots", auth, async (req, res) => {
  try {
    if (req.user.role !== "professor") return res.status(403).json({ message: "Access denied" });

    const { time } = req.body;
    const slot = new Slot({ professor: req.user.id, time });
    await slot.save();

    res.status(201).json({ message: "Slot added successfully", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get slots for this professor
router.get("/slots", auth, async (req, res) => {
  try {
    if (req.user.role !== "professor") return res.status(403).json({ message: "Access denied" });

    const slots = await Slot.find({ professor: req.user.id });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
