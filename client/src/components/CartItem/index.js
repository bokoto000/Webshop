import React, { Component } from "react";
import ProductCard from "../ProductCard";
import {
  Button,
  Dropdown,
  Image,
  Divider,
  Grid,
  Segment,
  Icon,
  Loader,
  Container
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import "./index.css";
import { post } from "../../helpers/fetch";

const get = require("../../helpers/fetch").get;

const maxProducts = 50;

export default class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stock: 0
    };
  }

  async componentDidMount() {
    this.setState({ stock: this.props.product.stock });
    let options = [];
    for (let i = 0; i <= maxProducts; i++) {
      options.push({ key: i, text: i.toString(), value: i });
    }
    const product = this.props.product;
    if (product.stock > maxProducts) {
      options.push({
        key: product.stock,
        text: product.stock.toString(),
        value: product.stock
      });
    }
    this.setState({ options });
  }

  async updateItemStock() {
    this.setState({ loading: true });
    const product = this.props.product;
    console.log(this.state.stock);
    const res = await post("/cart/update-item", {
      id: product.id,
      stock: this.state.stock
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Error changing quantity");
    }
    this.setState({ loading: false });
  }

  deleteItem = async () => {
    console.log("delete");
    this.setState({ loading: true });
    const product = this.props.product;
    console.log(this.state.stock);
    const res = await post("/cart/delete-item", {
      id: product.id
    });
    console.log(res);
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Error removing product");
    }
    this.setState({ loading: false });
  };

  handleChange = async (e, { value }) => {
    await this.setState({ stock: value });
    this.updateItemStock();
  };

  render() {
    const product = this.props.product;
    if (product && product.stock > 0)
      return (
        <Segment>
          {this.state.loading ? (
            <Loader></Loader>
          ) : (
            <Grid>
              <Grid.Row columns={5} className="cart-product-row">
                <Grid.Column>
                  <div style={{ width: "70px", height: "70px" }}>
                    <Image
                      src={product.image}
                      size="tiny"
                      verticalAlign="top"
                    />
                  </div>
                </Grid.Column>

                <Grid.Column>{product.name}</Grid.Column>

                <Grid.Column style={{ alignItems: "center" }}>
                  <Container>
                    <div className="cart-item-price"> {product.price} лв</div>
                  </Container>
                </Grid.Column>

                <Grid.Column>
                  {" "}
                  <Dropdown
                    name="stock"
                    options={this.state.options}
                    value={this.state.stock}
                    onChange={this.handleChange}
                    selection
                  />
                  <Button color="red" onClick={this.deleteItem}>
                    <Icon disabled name="x" />
                  </Button>
                </Grid.Column>
                <Grid.Column style={{ alignItems: "center" }}>
                  <Container>
                    <div className="cart-item-price">
                      {" "}
                      {product.productTotal} лв
                    </div>
                  </Container>
                </Grid.Column>
                <Divider />
              </Grid.Row>
            </Grid>
          )}
        </Segment>
      );
    else {
      return null;
    }
  }
}
