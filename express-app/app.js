require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.APP_PORT ?? 5000;

app.use(express.json());

const scoreHandlers = require("./scoreHandlers");
app.get("/scores", scoreHandlers.getScores);
app.post("/scores", scoreHandlers.validateScore, scoreHandlers.postScore);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
