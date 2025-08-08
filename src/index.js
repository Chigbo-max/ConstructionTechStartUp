const express = require("express");

const app = express();

app.use(express.json());


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const notificationRoutes = require('./routes/notifications');


app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;