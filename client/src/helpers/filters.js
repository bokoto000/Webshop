const filters = {
  filterNewest(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      const aId = Number(a.id), bId=Number(b.id);
      if (aId < bId) return 1;
      if (aId > bId) return -1;
      return 0;
    });
    return products;
  },

  filterOldest(products) {
    //let filteredProducts;
    products.sort(function(a, b) {
      const aId = Number(a.id), bId=Number(b.id);
      if (aId < bId) return -1;
      if (aId > bId) return 1;
      return 0;
    });
    return products;
  },

  filterLowestPrice(products) {
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

  filterHighestPrice(products) {
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

  filterBetweenPrice(products, lowerprice,higherprice){
    console.log(higherprice);
    let filteredProducts=[];
    for(let i =0; i<products.length;i++){
      const productPrice=parseFloat(products[i].price);
      const lower=parseFloat(lowerprice);
      const higher=parseFloat(higherprice)
      if(productPrice>=lowerprice&&productPrice<=higherprice){
        filteredProducts.push(products[i]);
      }
    }
    return filteredProducts;
  }
};

export default filters;
