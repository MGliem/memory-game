const database = require("./database");
const joi = require("joi");

const scoreSchema = joi.object({
  nickname: joi.string().max(255).required(),
  time: joi.number().integer().required(),
  move: joi.number().integer().required(),
  grid: joi.string().max(45).required()
});

const validateScore = (req, res, next) => {
  const { nickname, time, move, grid } = req.body;

  const { error } = scoreSchema.validate(
    { nickname, time, move, grid },
    { abortEarly: false }
  );

  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    next();
  }
};

const getScores = (req, res) => {
  database
    .query("select * from scores")
    .then(([scores]) => {
      res.json(scores);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Database error");
    });
};

const postScore = (req, res) => {
  const { nickname, time, move, grid } = req.body;

  database
    .query("insert into scores (nickname, time, move, grid) values (?, ?, ?, ?)", [
      nickname,
      time,
      move,
      grid,
    ])
    .then(([result]) => {
      res.location("/").sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Database error");
    });
};

module.exports = {
  validateScore,
  getScores,
  postScore,
};