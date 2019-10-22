const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels) => {
  const Tag = ormModels.Tag;

  router.post("/create", async (req, res, next) => {
    const user = req.user;
    if (user) {
      const name = req.body.name;
      try {
        await Tag.create({
            name
        });
      } catch (e) {
        return res.status(403).json({error:"Тагът вече съществува!"})
      }
      res.send(200);
    } else {
      res.sendStatus(400);
    }
  });

  router.get("/get-tags", async (req, res, next) => {
    const tags = await Tag.findAll();
    res.json({ tags });
  });


  return router;
};
