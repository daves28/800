const db = require('../db.js');
const scoreController = {};

scoreController.addScore = (req, res, next) => {
  console.log('Entering addScore');
  const { score } = req.body;
  const { username } = res.locals.user;
  const query = `INSERT INTO scores (username, score) VALUES ($1, $2) RETURNING *`;
  const values = [username, score];
  db.query(query, values, (err, data) => {
    if (err)
      return next({
        log: 'Error adding score in addScore',
        message: { error: `Error from database: ${err}` },
      });
    return next();
  });
};

scoreController.getUserScores = (req, res, next) => {
  console.log('Entering getUserScores');
  const { username } = res.locals.user;
  const query = `SELECT * FROM scores WHERE username = ($1) ORDER BY score DESC`;
  const values = [username];
  db.query(query, values, (err, data) => {
    if (err)
      return next({
        log: 'Error finding high scores in getHighScores',
        message: { error: `Error from database: ${err}` },
      });
    console.log('highscore', data.rows[0].score);
    res.locals.userHighScore = data.rows[0].score;
    return next();
  });
};

scoreController.getLeaderboard = (req, res, next) => {
  const query = `SELECT * FROM scores`;
  db.query(query, (err, data) => {
    if (err)
      return next({
        log: 'Error finding high scores in getLeaderboard',
        message: { error: `Error from database: ${err}` },
      });
    const scores = data.rows;
    scores.sort((a, b) => b.score - a.score);
    res.locals.leaderboard = scores;
    return next();
  });
};

module.exports = scoreController;
