module.exports = (app, models, passport, sequelize) => {
  app.use("/product", require("../routers/product")(models));
  app.use("/user", require("../routers/user")(passport, models));
  app.use("/cart", require("../routers/cart")(models));
  app.use("/order", require("../routers/order")(models));
  app.use("/resetpassword", require("../routers/resetpassword")(models));
  app.use("/get-sess-info", require("../routers/get-sess-info")());
  app.use("/status", require("../routers/status")());
  app.use("/paypal", require("../routers/paypal")(models));
  app.use("/verifyemail", require("../routers/verify-email")(models));
};
