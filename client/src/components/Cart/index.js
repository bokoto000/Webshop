import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import ProductCard from "../ProductCard";
import CartItem from "../CartItem";
import {
  Button,
  Input,
  Image,
  Divider,
  Grid,
  Segment,
  Container
} from "semantic-ui-react";
import filter from "../../helpers/filters";
import "./index.css";

const get = require("../../helpers/fetch").get;
const post = require("../../helpers/fetch").post;

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let cart = await (await get("/cart/get-cart")).json();
    cart = filter.filterHighestPrice(cart);
    if (cart) {
      let total = 0;
      for (let i = 0; i < cart.length; i++) {
        let productTotal = parseFloat(cart[i].price * cart[i].stock);
        total += productTotal;
        cart[i].productTotal = productTotal.toFixed(2);
      }
      this.setState({ cart });
      this.setState({ total });
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      this.setState({ cart });
    }
  }

  proceedOrder = async () => {
    try {
      const res = await post("/order/create");
      console.log(res);
      if (res.ok) this.props.history.push("/checkout");
      else {
        alert("Failed creating order");
      }
    } catch (e) {
      console.log(e);
      alert("Failed creating order");
    }
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
              return <CartItem key={product.id} product={product}></CartItem>;
            })
          : null}
        <Segment>
          <Grid>
            <Grid.Row columns={5} className="cart-product-row">
              <Grid.Column />

              <Grid.Column />

              <Grid.Column />
              <Grid.Column>Тотал:</Grid.Column>
              <Grid.Column style={{ alignItems: "center" }}>
                <div className="cart-item-price">
                  {" "}
                  {parseFloat(this.state.total).toFixed(2)} лв
                </div>
              </Grid.Column>
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

export default withRouter(Cart);
