import React, { Component } from "react";
import ProductCard from "../ProductCard";
import { Button, Card, Image, Divider, Grid, Segment } from "semantic-ui-react";
import "./index.css";

const get = require("../../helpers/fetch").get;

export default class CartItem extends Component {
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
        <Grid>
          <Grid.Row columns={5} className="cart-product-row">
            <Grid.Column>
            
            </Grid.Column>

            <Grid.Column>Име</Grid.Column>

            <Grid.Column>Цена</Grid.Column>

            <Grid.Column>Бройка</Grid.Column>
          </Grid.Row>
        </Grid>
        {cart
          ? cart.map(product => {
              return (
                <Segment>
                  <Grid>
                    <Grid.Row columns={5} className="cart-product-row">
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
                  </Grid>
                </Segment>
              );
            })
          : null}
      </div>
    );
  }
}
