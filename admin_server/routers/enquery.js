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
  
  router.get("/products/:startDate/:endDate", async (req, res, next) => {
      // TO DO Refactor
      /*
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
      } else res.sendStatus(403);*/

  });

  router.get("/orders", async (req, res) => {
    // TO DO 
    /*
    console.log(req.query);
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let lowerprice = null;
    if (req.query.lowerprice)
      lowerprice = parseFloat(req.query.lowerprice);
    let higherprice = null;
    if (req.query.higherprice)
      higherprice = parseFloat(req.query.higherprice);
    const groupBy = req.query.group
    const status = req.query.status;
    console.log(status);
    let orders = await sequelize.query(`SELECT "orders".*, array_agg(ordereditems.product_id || ' '|| ordereditems.stock) as "ordereditems",
    "ordereditems"."product_id" AS "productId", 
    "ordereditems"."stock" AS "stock",
     "ordereditems"."ordered_price" AS "orderedPrice",
       "ordereditems->product"."name" AS "productName",
        "ordereditems->product"."description" AS "productDescription",
         "ordereditems->product"."image" AS "productImage"
             FROM (SELECT "orders"."id",
               "orders"."status"
                FROM "orders" AS "orders" 
                WHERE "orders"."status" = '${status}' )
                 AS "orders"
                 LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                 LEFT OUTER JOIN "products" AS "ordereditems->product"
                  ON "ordereditems"."product_id" = "ordereditems->product"."id";`);
    return res.json(orders);
    */
    /*
        const startDate = req.params.startDate;
        const endDate = req.params.endDate;
        let lowerprice=null;
        if(req.params.lowerprice)
        lowerprice = parseFloat(req.params.lowerprice);
        let higherprice=null;
        if(req.params.higherprice)
        higherprice = parseFloat(req.params.higherprice);
        const higherprice = req.params.higherprice;
        const groupBy = req.params.group
        const status = req.params.status;
        const user = req.user;
        if (user && user.id) {
          let orders = await Order.findAll({
            where: { status }
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
                           WHERE "orders"."status" = '${status}' AND "orders"."id" = ${orderId} LIMIT 1)
                            AS "orders"
                            LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                            LEFT OUTER JOIN "products" AS "ordereditems->product"
                             ON "ordereditems"."product_id" = "ordereditems->product"."id";`);
              let itemsCount = fullOrder[0].length;
              let total = 0;
              for (let i = 0; i < itemsCount; i++) {
                let productTotal =
                  parseInt(fullOrder[0][i].stock) *
                  parseFloat(fullOrder[0][i].orderedPrice);
                total += productTotal;
                fullOrder[0][i].productTotal = productTotal;
              }
              fullOrder[2] = total;
              orders[i].dataValues.fullOrder = fullOrder[0];
              orders[i].dataValues.total = fullOrder[2];
              const user = await User.findOne({
                attributes: ["id", "username", "first_name", "last_name", "email"],
                where: { id: orders[i].dataValues.userId }
              });
    
              orders[i].dataValues.user = user;
            }
            res.status(200).json(orders);
          }
        } else res.sendStatus(403);
        */
  });


  return router;
};
