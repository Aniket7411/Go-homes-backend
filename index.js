require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
// const authRoutes = require("./routes/authRoute");
const routes = require("./routes/index.route")

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("For updation")


app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


// Routes
// app.use("/api/auth", authRoutes);
app.use('/api', routes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
