import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("B2B Project Preview is running!");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
