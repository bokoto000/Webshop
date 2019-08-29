import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import {
  Button,
  Input,
  Image,
  Divider,
  Grid,
  Segment,
  Form
} from "semantic-ui-react";
import "./index.css";

const get = require("../../helpers/fetch").get;
const post = require("../../helpers/fetch").post;

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const cartTest = await (await get("/cart/get-cart")).json();
    if (cartTest) {
      let total = 0;
      for (let i = 0; i < cartTest.length; i++) {
        let productTotal = parseFloat(cartTest[i].price * cartTest[i].stock);
        total += productTotal;
        cartTest[i].productTotal = productTotal;
      }
      this.setState({ cart: cartTest });
      this.setState({ total });
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      this.setState({ cart });
    }
  }

  proceedOrder = async () => {
    await post('/order/create');
  };

  render() {
    const cart = this.state.cart;
    return (
      <div>
        <Grid>
          <Grid.Row columns={5} className="cart-product-row">
            <Grid.Column />

            <Grid.Column>Име</Grid.Column>

            <Grid.Column>Цена/бр</Grid.Column>

            <Grid.Column>Количество</Grid.Column>

            <Grid.Column>Общо</Grid.Column>
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

                      <Grid.Column>{product.price} лв</Grid.Column>

                      <Grid.Column>
                        <Input type="number" value={product.stock} />
                      </Grid.Column>
                      <Grid.Column>{product.productTotal} лв</Grid.Column>
                      <Divider />
                    </Grid.Row>
                  </Grid>
                </Segment>
              );
            })
          : null}
        <Segment>
          <Grid>
            <Grid.Row columns={5} className="cart-product-row">
              <Grid.Column />

              <Grid.Column />

              <Grid.Column />
              <Grid.Column />

              <Grid.Column>Тотал:{this.state.total} лв</Grid.Column>
              <Divider />
            </Grid.Row>
            <Grid.Row columns={5} className="cart-product-row">
              <Grid.Column />

              <Grid.Column />

              <Grid.Column />
              <Grid.Column />

              <Grid.Column>
                <Button onClick={this.proceedOrder}>Продължи -></Button>
              </Grid.Column>
              <Divider />
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    );
  }
}
