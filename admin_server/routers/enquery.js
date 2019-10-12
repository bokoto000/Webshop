const express = require("express");

const Sequelize = require("sequelize");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const Op = Sequelize.Op;
const checkPermission = require("../helpers/checkPermissions");
router.use(checkPermission());

module.exports = (passport, ormModels, sequelize) => {
  const Order = ormModels.Order;
  const User = ormModels.User;

  router.get("/products/:startDate/:endDate", async (req, res, next) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    const user = req.user;
    const status = req.params.status;
    let productsData = [];
    let productsArr = [];
    if (user && user.id) {
      let orders = await Order.findAll({
        where: {
          status: "Verified",
          date: { [Op.gte]: startDate, [Op.lte]: endDate }
        }
      });
      if (!orders) {
        return res.sendStatus(403);
      } else {
        for (let i = 0; i < orders.length; i++) {
          const orderId = orders[i].dataValues.id;
          let fullOrder = await sequelize.query(`SELECT "orders".*,
           "ordereditems"."product_id" AS "productId", 
           "ordereditems"."stock" AS "stock",
            "ordereditems"."ordered_price" AS "orderedPrice",
              "ordereditems->product"."name" AS "productName",
               "ordereditems->product"."description" AS "productDescription",
                "ordereditems->product"."image" AS "productImage"
                    FROM (SELECT "orders"."id",
                      "orders"."status"
                       FROM "orders" AS "orders" 
                       WHERE "orders"."status" = 'Verified' AND "orders"."id" = ${orderId} LIMIT 1)
                        AS "orders"
                        LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                        LEFT OUTER JOIN "products" AS "ordereditems->product"
                         ON "ordereditems"."product_id" = "ordereditems->product"."id";`);

          let itemsCount = fullOrder[0].length;
          let total = 0;
          for (let i = 0; i < itemsCount; i++) {
            const id = fullOrder[0][i].productId;
            if (!productsData[id]) productsData[id] = { id: id };
            productsData[id].name = fullOrder[0][i].productName;
            if (!productsData[id].stock) productsData[id].stock = 0;
            productsData[id].stock =
              productsData[id].stock + fullOrder[0][i].stock;
          }
        }
        for (let i = 0; i < productsData.length; i++) {
          if (productsData[i] != null) productsArr.push(productsData[i]);
        }
        res.status(200).json({ productsArr, startDate, endDate });
      }
    } else res.sendStatus(403);
  });

  return router;
};
