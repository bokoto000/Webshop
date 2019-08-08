import React from "react";
import {
  Grid,
  Form,
  Image,
  Segment,
  Divider,
  Header,
  Button,
  Card
} from "semantic-ui-react";
import {Redirect } from "react-router-dom";
import ProductCard from '../ProductCard';
import "./index.css";

const get = require("../../helpers/fetch").get;

export default class ProductDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    const products = (await (await get("/product/get-products")).json())
      .products;
    this.setState({ products });
  }

  render() {
    const products = this.state.products;
    //console.log(products);
    return (
      <div style={{ height: "80vh", width: "100%" }}>
        <Card.Group itemsPerRow={4}>
          {products.map(product => {
            return (
              <ProductCard key={product.id} product={product}/>
            );
          })}
        </Card.Group>
      </div>
    );
  }
}
