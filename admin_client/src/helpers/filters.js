const filters = {
  filterNewest(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      const aId = Number(a.id),
        bId = Number(b.id);
      if (aId < bId) return 1;
      if (aId > bId) return -1;
      return 0;
    });
    return products;
  },

  filterOldest(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      const aId = Number(a.id),
        bId = Number(b.id);
      if (aId < bId) return -1;
      if (aId > bId) return 1;
      return 0;
    });
    return products;
  },
  sortNameAZ(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    return products;
  },

  sortNameZA(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      if (a.name > b.name) return -1;
      if (a.name < b.name) return 1;
      return 0;
    });
    return products;
  },

  sortStockUp(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      if (a.stock > b.stock) return -1;
      if (a.stock < b.stock) return 1;
      return 0;
    });
    return products;
  },

  sortStockDown(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      if (a.stock < b.stock) return -1;
      if (a.stock > b.stock) return 1;
      return 0;
    });
    return products;
  },
  sortCodeUp(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    });
    return products;
  },

  sortCodeDown(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
    return products;
  },

  sortLowestPrice(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      const aPrice = parseFloat(a.price),
        bPrice = parseFloat(b.price);
      if (aPrice < bPrice) return -1;
      if (aPrice > bPrice) return 1;
      return 0;
    });
    return products;
  },

  sortHighestPrice(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      const aPrice = parseFloat(a.price),
        bPrice = parseFloat(b.price);
      if (aPrice < bPrice) return 1;
      if (aPrice > bPrice) return -1;
      return 0;
      return 0;
    });
    return products;
  },

  filterBetweenPrice(products, lowerprice, higherprice) {
    let filteredProducts = [];
    if (null != higherprice)
      for (let i = 0; i < products.length; i++) {
        const productPrice = parseFloat(products[i].price);
        const lower = parseFloat(lowerprice);
        const higher = parseFloat(higherprice);
        if (null != higherprice) {
          if (productPrice >= lower && productPrice <= higher) {
            filteredProducts.push(products[i]);
          }
        } else {
          if (lower <= productPrice) {
            filteredProducts.push(products[i]);
          }
        }
      }
    else
      for (let i = 0; i < products.length; i++) {
        const productPrice = parseFloat(products[i].price);
        const lower = parseFloat(lowerprice);
        if (lower <= productPrice) {
          filteredProducts.push(products[i]);
        }
      }
    return filteredProducts;
  }
};

export default filters;
