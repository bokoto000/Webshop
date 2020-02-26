const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const matcher = require("../helpers/match");

router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = models => {
  const ProductImage = models.ProductImage;

  router.get("/get-product-image/:id", async (req, res) => {
    const id = req.params.id;
    const image_data = await ProductImage.findOne(id);
    if (image_data) {
      return res.status(200).json({ image_data:image_data.image_data });
    } else {
      return res.sendStatus(403);
    }
  });


  return router;
};
