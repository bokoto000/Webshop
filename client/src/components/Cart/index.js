import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CartItem from "../CartItem";
import {
  Button,
  Divider,
  Grid,
  Segment,
  Loader
} from "semantic-ui-react";
import filter from "../../helpers/filters";
import "./index.css";

const get = require("../../helpers/fetch").get;
const post = require("../../helpers/fetch").post;

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updatedItemHandler = this.updatedItemHandler.bind(this);
  }

  async componentDidMount() {
    let cart = await (await get("/cart/get-cart")).json();
    cart = filter.filterHighestPrice(cart);
    if (cart) {
      this.calculateTotal(cart);
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      this.setState({ cart });
    }
  }

  calculateTotal(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      let productTotal = parseFloat(cart[i].price * cart[i].stock);
      total += productTotal;
      cart[i].productTotal = productTotal.toFixed(2);
    }
    cart = filter.filterNewest(cart);
    this.setState({ cart });
    this.setState({ total });
  }

  proceedOrder = async () => {
    try {
      const res = await post("/order/create");
      if (res.ok) this.props.history.push("/checkout");
      else {
        const json = await res.json();
        alert(json.error);
      }
    } catch (e) {
      alert("Failed creating order");
    }
  };

  updatedItemHandler(item) {
    if (item) {
      this.setState({ recalculatingTotal: true });
      let cart = this.state.cart;
      const cartLength = cart.length;
      for (let i = 0; i < cartLength; i++) {
        if (cart[i].id === item.id) cart[i] = item;
      }
      this.calculateTotal(cart);
      this.setState({ recalculatingTotal: false });
    }
  }

  render() {
    const cart = this.state.cart;
    return (
      <div style={{minHeight:"80vh"}}>
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
                <CartItem
                  key={product.id}
                  product={product}
                  updatedItemHandler={this.updatedItemHandler}
                ></CartItem>
              );
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
                {this.state.recalculatingTotal ? (
                  <Loader active></Loader>
                ) : (
                  <div className="cart-item-price">
                    {" "}
                    {parseFloat(this.state.total).toFixed(2)} лв
                  </div>
                )}
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
