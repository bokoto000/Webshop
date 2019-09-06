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

  router.post("/create", async (req, res) => {
    const user = req.user;
    console.log(user.id);
    if (user && user.id) {
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        return res.sendStatus(422);
      }
      cartId = cart.dataValues.id;
      const items = await sequelize.query(`SELECT "items"."id",
       "items"."cart_id" AS "cartId",
        "items"."product_id" AS "productId",
         "items"."stock",
          "product"."id" AS "product.id",
           "product"."name" AS "product.name",
            "product"."description" AS "product.description",
             "product"."image" AS "product.image",
              "product"."price" AS "orderedPrice",
               "product"."stock" AS "product.stock" FROM "items" AS "items"
                LEFT OUTER JOIN "products" AS "product" ON "items"."product_id" = "product"."id" WHERE "items"."cart_id" = 9;
      `);
      const order = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (order) {
        await Order.destroy({ where: { id: order.dataValues.id } });
        await OrderedItem.destroy({ where: { orderId: order.dataValues.id } });
        await Order.create({ userId: user.id, status: "New" });
      } else {
        await Order.create({ userId: user.id, status: "New" });
      }
      const newOrder = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (newOrder) {
        newOrderId = newOrder.dataValues.id;
        for (let i = 0; i < items[0].length; i++) {
          const productId = items[0][i].productId;
          const stock = items[0][i].stock;
          const orderedPrice = items[0][i].orderedPrice;
          await OrderedItem.create({
            orderId: newOrderId,
            productId,
            stock,
            orderedPrice
          });
        }
      }

      //console.log(items);
      //console.log(cart);
      res.json(items[0]);
    } else res.sendStatus(403);
  });

  router.get("/get-all/:status", async (req, res) => {
    const user = req.user;
    const status = req.params.status;
    console.log(status);
    if (user && user.id) {
      let orders = await Order.findAll({
        where: { status }
      });
      //return res.json(orders);
      if (!orders) {
        return res.sendStatus(403);
      } else {
        for (let i = 0; i < orders.length; i++) {
          console.log(orders[i]);
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
          orders[i].dataValues.fullOrder= fullOrder[0] ;
          orders[i].dataValues.total = fullOrder[2];
          console.log(orders[i].dataValues.userId);
          const user = await User.findOne({attributes:['id','username','first_name','last_name','email'], where:{id:orders[i].dataValues.userId}});
          
          orders[i].dataValues.user=user;
        }
        res.status(200).json(orders);
      }
    } else res.sendStatus(403);
  });
  
  router.post("/update-status/:status", async function(req,res){
    const user=req.user;
    const status = req.params.status;
    const orderId = req.body.orderId;
    if(user&&user.id){
      const update=await Order.update({status},{where:{id:orderId}});
      if(update){
        return res.sendStatus(200);
      }
      else{
        return res.sendStatus(403);
      }
    }
  })

  return router;
};
