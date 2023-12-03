const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const { errorHandler } = require("./middleware/errorMiddleware");
const app = express();
const colors = require("colors");
const connectDb = require("./config/db");
const path = require("path");

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

//Serve routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
