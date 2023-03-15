const express = require("express");

const router = express.Router();
const ensureLoggedIn = require("./../middlewares/ensure_logged_in");

const db = require("./../db");

router.get("/exercises", ensureLoggedIn, (req, res) => {
  const sql = "SELECT * FROM exercises ORDER BY title ASC;";

  db.query(sql, (err, dbRes) => {
    const exercises = dbRes.rows;
    res.render("exercise_list", {
      exercises: exercises,
    });
  });
});

router.get("/exercises/new", ensureLoggedIn, (req, res) => {
  res.render("exercise_new");
});

router.get("/exercises/:id", ensureLoggedIn, (req, res) => {
  const sql = `select * from exercises where exercise_id = $1;`;
  console.log(sql);

  db.query(sql, [req.params.id], (err, dbRes) => {
    if (err) {
      console.log(err);
    } else {
      const exercise = dbRes.rows[0];
      res.render("exercise_details", { exercise });
    }
  });
});

router.post("/exercises", ensureLoggedIn, (req, res) => {
  const sql = `
    INSERT INTO exercises (exercise_title, weight, sets, reps, rest, exercise_user_id) VALUES ($1, $2, $3, $4, $5, $6);
  `;

  db.query(
    sql,
    [
      req.body.exercise_title,
      req.body.weight,
      req.body.sets,
      req.body.reps,
      req.body.rest,
      req.session.userId,
    ],
    (err, dbRes) => {
      res.redirect("/exercises");
    }
  );
});

router.get("/exercises/:exercise_id/edit", ensureLoggedIn, (req, res) => {
  const sql = `SELECT * FROM exercises WHERE exercise_id = $1;`;

  db.query(sql, [req.params.id], (err, dbRes) => {
    if (err) {
      console.log(err);
    } else {
      const exercise = dbRes.rows[0];
      res.render("exercise_edit", { exercise: exercise });
    }
  });
});

router.put("/exercises/:exercise_id", ensureLoggedIn, (req, res) => {
  const sql = `UPDATE exercises SET exercise_title = $1, WHERE exercise_id = $2;`;

  db.query(
    sql,
    [
      req.body.exercise_title,
      req.body.weight,
      req.body.sets,
      req.body.reps,
      req.body.rest,
      req.params.exercise_id,
    ],
    (err, dbRes) => {
      res.redirect(`/exercises/${req.params.exercise_id}`);
    }
  );
});

router.delete("/exercises/:exercise_id", ensureLoggedIn, (req, res) => {
  const sql = `DELETE FROM exercises WHERE exercise_id = $1;`;

  db.query(sql, [req.params.id], (err, dbRes) => {
    res.redirect("/exercises");
  });
});

module.exports = router;
