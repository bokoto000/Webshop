module.exports = {
  Admin: {
    permissions: [
      "/cart/get-cart",
      "/cart/update-item",
      "/cart/buy-item",
      "/cart/delete-item"
    ]
  },
  Guest: {},
  User: {
    permissions: [
      "/cart/get-cart",
      "/cart/update-item",
      "/cart/buy-item",
      "/cart/delete-item"
    ]
  }
};
