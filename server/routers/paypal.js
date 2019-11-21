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

module.exports = models => {
  const Order = models.Order;
  const PendingPayment = models.PendingPayment;
  const OrderedItem = models.OrderedItem;
  const Product = models.Product;
  const Cart = models.Cart;
  const Item = models.Item;

  router.post("/pay", async (req, res) => {
    const user = req.user;
    let items = [];
    let total = 0;
    let order;
    if (user && user.id) {
      order = await Order.findNewOrderByUserId(user.id);
      if (!order) {
        return res.sendStatus(403);
      } else {
        let fullOrder = await OrderedItem.findAllOrderedProductsByOrder(
          order.id
        );
        let itemsCount = fullOrder.length;
        for (let i = 0; i < itemsCount; i++) {
          const item = fullOrder[i];
          let productTotal =
            parseInt(item.stock) * parseFloat(item.orderedPrice);
          total += productTotal;
          items.push({
            name: item.productName,
            sku: item.productId.toString(),
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
        const orderId = order.id;
        await PendingPayment.create(orderId, paymentId, total);
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
    const payment = await PendingPayment.findOne(paymentId);
    const orderId = payment.order_id;
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: payment.total
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
            const order = await Order.findNewOrderByOrderId(orderId);
            console.log(order);
            const userId = order.user_id;
            if (!order) {
              return res.sendStatus(403);
            } else {
              const updatedOrder = await Order.updateStatus(order.id, "Paid");
              if (updatedOrder) {
                const cart = await Cart.findOneByUserId(userId);
                if (cart) {
                  await Item.destroyByCart(cart.id);
                  await Cart.destroy(userId);
                }

                const orderedItems = await OrderedItem.findAllOrderedProductsByOrder(
                  order.id
                );
                for (let i = 0; i < orderedItems.length; i++) {
                  const item = orderedItems[i];
                  if (item) {
                    const leftStock = item.leftStock;
                    const stock = item.stock;
                    const productId = item.productId;
                    const product = await Product.updateStock(
                      productId,
                      leftStock - stock
                    );
                  }
                }
                await PendingPayment.destroy(paymentId);
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
