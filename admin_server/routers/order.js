const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);



module.exports = (passport, ormModels, sequelize) => {
  const Item = ormModels.Item;
  const Cart = ormModels.Cart;
  const OrderedItem = ormModels.OrderedItem;
  const Order = ormModels.Order;
  const User = ormModels.User;
  const Product = ormModels.Product;

  router.get("/get-all/:status", async (req, res) => {
    const user = {id:1}//req.user;
    const status = req.params.status;
    if (user && user.id) {
      let orders = await Order.findAll({
        where: { status }
      });
      console.log(status);
      console.log(orders);
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
                    "orders"."status",
                    "orders"."total"
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
  });

  router.post("/update-status/:status", async function(req, res) {
    const user = req.user;
    const status = req.params.status;
    const orderId = req.body.orderId;
    if (user && user.id) {
      const update = await Order.update({ status }, { where: { id: orderId } });
      if (status == "Canceled") {
        const orderedItems = await OrderedItem.findAll({ where: { orderId } });
        const orderedItemsLength = orderedItems.length;
        for (let i = 0; i < orderedItemsLength; i++) {
          const productId = orderedItems[i].dataValues.productId;
          const stock = orderedItems[i].dataValues.stock;
          const product = await Product.findOne({ where: { id: productId } });
          await Product.update({ stock: product.dataValues.stock + stock },{where:{id:productId}});
        }
      }
      if (update) {
        return res.sendStatus(200);
      } else {
        return res.sendStatus(403);
      }
    }
  });

  return router;
};
