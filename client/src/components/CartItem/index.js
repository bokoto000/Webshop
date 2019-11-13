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
  Container,
  Label,
  Dimmer
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
      stock: 0,
      notEnoughStock: false
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
    if (product.stock > product.leftStock) {
      this.setState({ notEnoughStock: true });
    }
    this.setState({ options, product });
  }

  async updateItemStock() {
    this.setState({ loading: true });
    const product = this.state.product;
    let res;
    if (this.state.stock > 0)
      res = await post("/cart/update-item", {
        id: product.id,
        stock: this.state.stock
      });
    else {
      res = await post("/cart/delete-item", {
        id: product.id
      });
    }
    if (res.ok) {
      let updatedProduct = (await res.json()).product[0];
      if (updatedProduct) {
        updatedProduct.productTotal = parseFloat(updatedProduct.price * updatedProduct.stock).toFixed(2);
        this.props.updatedItemHandler(updatedProduct);
        this.setState({ product: updatedProduct });
      }  else{
        this.props.updatedItemHandler(null);
        this.setState({ product: null });
      }
    } else {
      alert("Error changing quantity");
    }
    this.setState({ loading: false });
  }

  deleteItem = async () => {
    this.setState({ loading: true });
    const product = this.props.product;
    const res = await post("/cart/delete-item", {
      id: product.id
    });
    if (res.ok) {
      this.setState({ product: null });
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
    const product = this.state.product;
    if (product && product.stock > 0)
      return (
        <Segment style={{ minHeight: "100px" }}>
          {this.state.loading ? (
            <Dimmer active inverted>
              <Loader />
            </Dimmer>
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

                  <Grid.Column>
                    {product.name}
                    <br></br>
                    Код:{product.id}
                  </Grid.Column>

                  <Grid.Column style={{ alignItems: "center" }}>
                    <Container>
                      <div className="cart-item-price"> {product.price} лв</div>
                    </Container>
                  </Grid.Column>

                  <Grid.Column>
                    {" "}
                    <Dropdown
                      onChange={this.handleChange}
                      options={this.state.options}
                      selection
                      value={product.stock}
                    />
                    <Button color="red" onClick={this.deleteItem}>
                      <Icon disabled name="x" />
                    </Button>
                    {this.state.notEnoughStock ? (
                      <Label basic color="red">
                        Остават само {product.leftStock} продукта.
                    </Label>
                    ) : null}
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
