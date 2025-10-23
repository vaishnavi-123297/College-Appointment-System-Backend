const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const professorRoutes = require("./routes/professor");
const appointmentRoutes = require("./routes/appointment");

app.use("/api/auth", authRoutes);
app.use("/api/professor", professorRoutes);
app.use("/api/appointment", appointmentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
