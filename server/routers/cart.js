const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = (passport, ormModels,sequelize) => {
  const Item = ormModels.Item;
  const Cart = ormModels.Cart;
  const Product = ormModels.Product;

  router.get("/get-cart", async (req, res) => {
    const user = req.user;
    if (user && user.id) {
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        await Cart.create({
          userId: user.id
        });
      }
      const cartId=cart.dataValues.id;
      const items = await sequelize.query(`SELECT "items"."id",
         "items"."stock",
          "product"."id" AS "id",
           "product"."name" AS "name",
            "product"."description" AS "description",
             "product"."image" AS "image",
              "product"."price" AS "price",
              "product"."stock" AS "leftStock"
                FROM "items" AS "items" LEFT OUTER JOIN "products" AS "product" ON "items"."product_id" = "product"."id" WHERE "items"."cart_id" = ${cartId}`);
      /*const items = await Item.findAll({
        where: { cartId: cart.dataValues.id },
        include:{
            model:Product
        }
      });*/
      res.json(items[0]);
    } else res.sendStatus(403);
  });

  router.post("/update-item", async (req, res) => {
    console.log('test');
    const user = req.user;
    const itemId = req.body.id;
    stock = req.body.stock;
    console.log(itemId+ " "+stock);
    if (user && user.id) {
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        await Cart.create({
          userId: user.id
        });
      }
      cartId = cart.dataValues.id;
      const item = await Item.findOne({ where: { cartId: cartId, productId:itemId } });
      if (!item) {
        if (!stock) stock = 1;
        await Item.create({
          cartId: cartId,
          productId: itemId,
          stock: stock
        });
      } else {
        await Item.update(
          {
            stock: stock
          },
          {
            where: {
              cartId: cartId,
              productId: itemId
            }
          }
        );
      }
      //console.log(cart);
      res.json(cart);
    } else res.sendStatus(403);
  });


  router.post("/buy-item", async (req, res) => {
    console.log('test');
    const user = req.user;
    const itemId = req.body.id;
    stock = req.body.stock;
    console.log(itemId+ " "+stock);
    if (user && user.id) {
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        await Cart.create({
          userId: user.id
        });
      }
      cartId = cart.dataValues.id;
      const item = await Item.findOne({ where: { cartId: cartId, productId:itemId } });
      if (!item) {
        if (!stock) stock = 1;
        await Item.create({
          cartId: cartId,
          productId: itemId,
          stock: stock
        });
      } else {
        await Item.update(
          {
            stock: item.dataValues.stock+1
          },
          {
            where: {
              cartId: cartId,
              productId: itemId
            }
          }
        );
      }
      //console.log(cart);
      res.json(cart);
    } else res.sendStatus(403);
  });


  router.post("/delete-item", async (req, res) => {
    console.log('test');
    
    const user = req.user;
    const itemId = req.body.id;
    if (user && user.id) {
      const cart = await Cart.findOne({ where: { userId: user.id } });
      if (!cart) {
        await Cart.create({
          userId: user.id
        });
      }
      cartId = cart.dataValues.id;
      const item = await Item.findOne({ where: { cartId: cartId, productId:itemId } });
      if (!item) {
        return(422);
      } else {
        await Item.destroy(
          {
            where: {
              cartId: cartId,
              productId: itemId
            }
          }
        );
      }
      console.log(item);
      res.sendStatus(200);
    } else res.sendStatus(403);
  });

  return router;
};
