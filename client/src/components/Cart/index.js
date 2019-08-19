import React, { Component } from "react";
import ProductCard from "../ProductCard";
import { Button, Card, Image, Divider, Grid } from "semantic-ui-react";
import "./index.css";

const get = require("../../helpers/fetch").get;

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.setState({ cart });
    const products = (await (await get("/product/get-products")).json())
      .products;
    this.setState({ products });
  }

  render() {
    const cart = this.state.cart;
    return (
      <div>
        <Grid divided='vertically'>
          <Grid.Row columns={4}>
            <Grid.Column> </Grid.Column>

            <Grid.Column>Име</Grid.Column>

            <Grid.Column>Цена</Grid.Column>

            <Grid.Column>Бройка</Grid.Column>
          </Grid.Row>

          {cart
            ? cart.map(product => {
                return (
                  <Grid.Row columns={4} className="cart-product-row">
                    <Grid.Column>
                      <Image
                        src={product.image}
                        size="tiny"
                        verticalAlign="top"
                      />
                    </Grid.Column>

                    <Grid.Column>{product.name}</Grid.Column>

                    <Grid.Column>{product.price}</Grid.Column>

                    <Grid.Column>{product.count}</Grid.Column>
                    <Divider />
                  </Grid.Row>
                );
              })
            : null}
        </Grid>
      </div>
    );
  }
}
