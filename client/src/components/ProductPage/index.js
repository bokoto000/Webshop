import React, { Component } from "react";
import {
  Grid,
  Header,
  Divider,
  Image,
  Container,
  Segment,
  Button
} from "semantic-ui-react";
import { NotificationManager } from "react-notifications";

const get = require("../../helpers/fetch").get;
const post = require("../../helpers/fetch").post;

export default class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const product = (await (await get(`/product/get-product/${id}`)).json())
      .product;
    this.setState({ product });
  }

  async buyItem() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const product = this.state.product;
    if (cart !== "[]") {
      let done = false;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
          cart[i].count++;
          done = true;
        }
      }
      if (done === false) {
        cart.push({
          id: product.id,
          name: product.name,
          image: product.image,
          description: product.description,
          price: product.price,
          count: 1
        });
      }
    } else {
      cart = [];
      cart.push({ id: product.id, count: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    const res = await post("/cart/buy-item", {
      id: product.id
    });
    if (res.ok) {
      NotificationManager.success("Добавен Продукт", "", 3000, () => {
        alert("callback");
      });
    } else {
      NotificationManager.error(
        "Проблем при добавянето на продукт ",
        "",
        3000,
        () => {
          alert("callback");
        }
      );
    }
  }

  render() {
    const product = this.state.product;
    if (product)
      return (
        <div style={{ paddingLeft: "300px", paddingRight: "300px" }}>
          <Header>{product.name}</Header>
          <Divider />
          <Grid>
            <Grid.Row>
              <Grid.Column width={6}>
                <Image src={product.image}></Image>
              </Grid.Column>
              <Grid.Column width={5}>
                <Header>Кратко описание:</Header>
                <Divider />
                <Container>{product.description}</Container>
              </Grid.Column>
              <Grid.Column width={5}>
                <Segment>
                  Цена:{" "}{product.price}
                  <Divider></Divider>
                  <Button positive onClick={() => this.buyItem()}>
                    Купи
                  </Button>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={13}>
                <Header>Описание:</Header>
                </Grid.Column>
                <Grid.Column width={2}>
                <Container>Код на продукта: {product.id}</Container>
                </Grid.Column>
              <Divider />
            </Grid.Row>
            <Grid.Row>
              <Container>{product.description}</Container>
            </Grid.Row>
          </Grid>
        </div>
      );
    else return null;
  }
}
