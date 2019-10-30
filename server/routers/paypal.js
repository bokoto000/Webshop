const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");

router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

paypal.configure({
  mode: "sandbox", //this line here says that we are not using real money.
  client_id:
    "Ab4whDPcfI7NexQc8JOy-RRgdOJ4q4Ha3GDqwYhOYGHr-vYK7cWGSLMGbd9itp-TR5_YhCsWYMkAme7J",
  client_secret:
    "EIRTG0a9Nqwogqe3__UuE1iDBCQohZE32eu_HsqxdQwG0-jSRcmhrNHlMiS0WeAr1a7KkWnDXkRqqEX1"
});

module.exports = (sequelize, ormModels) => {
  const Order = ormModels.Order;
  const PendingPayment = ormModels.PendingPayment;
  const Product = ormModels.Product;
  const Cart = ormModels.Cart;
  const Item = ormModels.Item;

  router.post("/pay", async (req, res) => {
    const user = req.user;
    let items = [];
    let total = 0;
    let order;
    if (user && user.id) {
      order = await Order.findOne({
        where: { userId: user.id, status: "New" }
      });
      if (!order) {
        return res.sendStatus(403);
      } else {
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
                           WHERE "orders"."status" = 'New' AND "orders"."user_id" = ${user.id} LIMIT 1)
                            AS "orders"
                            LEFT OUTER JOIN "ordereditems" AS "ordereditems" ON "orders"."id" = "ordereditems"."order_id" 
                            LEFT OUTER JOIN "products" AS "ordereditems->product"
                             ON "ordereditems"."product_id" = "ordereditems->product"."id";`);
        let itemsCount = fullOrder[0].length;
        for (let i = 0; i < itemsCount; i++) {
          const item = fullOrder[0][i];
          let productTotal =
            parseInt(item.stock) * parseFloat(item.orderedPrice);
          total += productTotal;
          items.push({
            name: item.productName,
            sku: item.id.toString(),
            price: item.orderedPrice,
            currency: "USD",
            quantity: item.stock.toString()
          });
        }
      }
    } else res.sendStatus(403);
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: "http://localhost:5000/paypal/success",
        cancel_url: "http://localhost:5000/paypal/cancel"
      },
      transactions: [
        {
          item_list: {
            items: items
          },
          amount: {
            currency: "USD",
            total: total.toString()
          },
          description: "Test"
        }
      ]
    };
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error(error);
        throw error;
      } else {
        const paymentId = payment.id;
        const orderId = order.dataValues.id;
        await PendingPayment.create({ orderId, paymentId, total });
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            return res.json({ href: payment.links[i].href });
          }
        }
      }
    });
  });

  router.get("/success", async (req, res) => {
    console.log("Success");
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const payment = await PendingPayment.findOne({ where: { paymentId } });
    const orderId = payment.dataValues.orderId;
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: payment.dataValues.total
          }
        }
      ]
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          if (orderId) {
            const order = await Order.findOne({
              where: { id: orderId, status: "New" }
            });
            const userId = order.dataValues.userId;
            if (!order) {
              return res.sendStatus(403);
            } else {
              const updatedOrder = await Order.update(
                { status: "Paid" },
                { where: { id: order.dataValues.id } }
              );
              if (updatedOrder) {
                const cart = await Cart.findOne({ where: { userId } });
                if (cart){
                  await Item.destroy({ where: { cartId: cart.dataValues.id } });
                  await Cart.destroy({ where: { userId } });}

                const orderedItems = await sequelize.query(`SELECT "ordereditems"."id",
                "ordereditems"."id" AS "id",
                "ordereditems"."product_id" AS "productId",
                "ordereditems"."stock",
                "product"."id" AS "product.id",
                    "product"."name" AS "product.name",
                    "product"."description" AS "product.description",
                    "product"."image" AS "product.image",
                    "product"."price" AS "orderedPrice",
                        "product"."stock" AS "leftStock"
                        FROM "ordereditems" AS "ordereditems"
                        LEFT OUTER JOIN "products" AS "product" ON "ordereditems"."product_id" = "product"."id"
                            WHERE "ordereditems"."order_id" = ${order.dataValues.id};`);
                for (let i = 0; i < orderedItems[0].length; i++) {
                  if (orderedItems[0][i]) {
                    const item = orderedItems[0][i];
                    const leftStock = item.leftStock;
                    const stock = item.stock;
                    const productId = item.productId;
                    const product = await Product.update(
                      { stock: leftStock - stock },
                      { where: { id: productId } }
                    );
                  }
                }
                await PendingPayment.destroy({ where: { paymentId } });
                return res.redirect("http://localhost:3000/success-order");
              } else return res.send(403);
            }
          } else return res.sendStatus(403);
        }
      }
    );
  });

  router.get("/cancel", (req, res) => {
    return res.send("Cancelled");
  });
  return router;
};
