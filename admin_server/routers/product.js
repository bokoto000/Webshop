const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const faker = require("faker");
const fs = require('fs');
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true
  })
);

function compare(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}

//const checkPermission = require("../helpers/checkPermissions");
//router.use(checkPermission());

module.exports = ( models, sequelize) => {
  const Product = models.Product;
  const Tag = models.Tag;
  const ProductTag = models.ProductTag;
  const ProductImage = models.ProductImage;

  router.post("/create", async (req, res, next) => {
    const user = req.user;
    if (user) {
      const image = req.body.image;
      const description = req.body.description;
      const name = req.body.name;
      const price = req.body.price;
      const stock = req.body.stock;
      try {
        await Product.create(image, name, description, price, stock);
      } catch (e) {
        console.log(e);
      }
      res.send(200);
    } else {
      res.sendStatus(400);
    }
  });

  router.get("/get-products", async (req, res, next) => {
    const products = await Product.findAll();
    //transforming the query results into good format
    //vuprosche moga li direktno ot query da obedinqvam rezultati
    products.sort(compare);
    productsRes = [];
    product = products[0];
    productsRes.push({
      description: product.description,
      name: product.name,
      id: product.id,
      image: product.image,
      price: product.price,
      stock: product.stock,
      tags: []
    });
    if (product.tagId) {
      productsRes[0].tags.push({ id: product.tagId, name: product.tagName });
    }
    lastProduct = 0;
    for (i = 1; i < products.length; i++) {
      product = products[i];
      if (productsRes[lastProduct].id == product.id) {
        productsRes[lastProduct].tags.push({
          id: product.tagId,
          name: product.tagName
        });
      } else {
        lastProduct++;
        productsRes.push({
          description: product.description,
          name: product.name,
          id: product.id,
          image: product.image,
          price: product.price,
          stock: product.stock,
          tags: []
        });
        if (product.tagId) {
          productsRes[lastProduct].tags.push({
            id: product.tagId,
            name: product.tagName
          });
        }
      }
    }
    //console.log(productsRes);
    return res.json({ products: productsRes });
  });

  router.post("/update-stock", async (req, res, next) => {
    const user = req.user;
    if (user) {
      console.log("updating stonks");
      const id = req.body.id;
      const stock = req.body.stock;
      try {
        await Product.updateStock(id, stock);
      } catch (e) {
        console.error(e);
      }
      return res.sendStatus(200);
    }
  });

  router.post("/update-product", async (req, res, next) => {
    const user = req.user;
    if (user) {
      const id = req.body.id;
      const image = req.body.image;
      const description = req.body.description;
      const name = req.body.name;
      const price = req.body.price;
      const tags = req.body.tags;
      try {
        for (i = 0; i < tags.length; i++) {
          const test = await ProductTag.findOne(id, tags[i].id);
          if (test.length == 0) {
            await ProductTag.create(id, tags[i].id);
          }
        }
      } catch (e) {
        console.log(e);
      }
      try {
        await Product.update(id, image, name, description, price);
      } catch (e) {
        console.log(e);
      }
      return res.send(200);
    } else {
      return res.sendStatus(400);
    }
  });

  router.post("/fake", async (req, res, next) => {
    const fakes = [];
    for (let i = 0; i <= 30000; i++) {
      fakes.push({
        description: faker.commerce.product(),
        name: faker.commerce.productName() + faker.commerce.product(),
        image: faker.image.image(),
        price: faker.commerce.price(),
        stock: 100
      });
    }
    let failed = 0;
    for (let i = 0; i < fakes.length; i++) {
      try {
        const image = fakes[i].image;
        const name = fakes[i].name;
        const description = fakes[i].description;
        const price = fakes[i].price;
        const stock = fakes[i].stock;
        const product = await Product.create(
          image,
          name,
          description,
          price,
          stock
        );
      } catch (e) {
        console.log(e);
        failed++;
      }
    }
    console.log(failed);
    return res.json(fakes);
  });

  function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

  router.post("/fake-images", async (req, res, next) => { 
    const fakes = [];
    const fakeImage = base64_encode('/home/boris/Desktop/ardes.jpg');
    const products = (await sequelize.query(`SELECT id FROM products`))[0];
    const count =(await sequelize.query(`SELECT COUNT(id) FROM productimages WHERE image_data='${fakeImage}'`))[0][0];
    console.log(count);
    const n = products.length;
    for(k=0;k<6;k++){
    for (let i = n/5*k; i <n; i++) {
      try{
        await ProductImage.create(products[i].id,fakeImage);
        if(i%1000==0)console.log(i);
      }catch(e){
        console.log(e);
      }
    }
  }

    return res.json(fakes);
  });

  router.post("/fake-tags", async (req, res, next) => {
    const tags = await Tag.findAll();
    const fakes = [];
    const productsQuery = await sequelize.query(`SELECT "products"."id", "products"."name",
     "products"."description",
      "products"."image",
       "products"."price",
        "products"."stock",
             "producttags->tags"."tag_id" AS "tagId",
              "producttags->tags"."name" AS "tagName"
                FROM "products" AS "products" LEFT OUTER JOIN "producttags" AS "producttags" ON "products"."id" = "producttags"."product_id"
                 LEFT OUTER JOIN "tags" AS "producttags->tags" ON "producttags"."tag_id" = "producttags->tags"."tag_id"`);
    const products = productsQuery[0];
    for (i = 0; i < products.length; i++) {
      let product = products[i];
      var tag = tags[Math.floor(Math.random() * tags.length)];
      if (!product.tagId) {
        console.log(product);
        await ProductTag.create(product.id, tag.dataValues.id);
      }
    }
    return res.json(fakes);
  });

  return router;
};
