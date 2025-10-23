const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");

// View available slots of a professor
router.get("/slots/:professorId", auth, async (req, res) => {
  try {
    const slots = await Slot.find({ professor: req.params.professorId });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book appointment
router.post("/book", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });

    const { professorId, time } = req.body;

    // Check if slot exists
    const slot = await Slot.findOne({ professor: professorId, time });
    if (!slot) return res.status(400).json({ message: "Slot not available" });

    // Create appointment
    const appointment = new Appointment({
      student: req.user.id,
      professor: professorId,
      time,
    });
    await appointment.save();

    // Remove booked slot
    await slot.remove();

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel appointment (professor)
router.delete("/cancel/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (req.user.role !== "professor") return res.status(403).json({ message: "Access denied" });

    await appointment.remove();
    res.json({ message: "Appointment canceled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Student view appointments
router.get("/my", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });

    const appointments = await Appointment.find({ student: req.user.id }).populate("professor", "name email");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
