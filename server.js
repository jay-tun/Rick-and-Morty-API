const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const characterRoutes = require("./routes/characters");
const externalRoutes = require("./routes/external");
const aiRoutes = require("./routes/ai");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Rick and Morty API is running!");
});

app.use("/auth", authRoutes);
app.use("/characters", characterRoutes);
app.use("/external", externalRoutes);
app.use("/ai", aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));