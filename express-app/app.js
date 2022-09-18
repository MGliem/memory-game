require("dotenv").config();
const cors = require('cors');

const express = require("express");
const app = express();
const port = process.env.APP_PORT ?? 5000;

app.use(express.json());
app.use(cors({origin: 'http://127.0.0.1:5500'}));

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
