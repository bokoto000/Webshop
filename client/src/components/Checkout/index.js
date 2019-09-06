import React, { Component } from "react";
import {
  Button,
  Input,
  Image,
  Divider,
  Grid,
  Segment,
  Container
} from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { get, post } from "../../helpers/fetch";
import "./index.css";

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null
    };
  }

  async componentDidMount() {
    console.log("checkout");
    const res = await (await get("/order/get")).json();
    if (res[0].length > 0) {
      //console.log(res[0]);
      this.setState({ order: res[0] });
      this.setState({ total: res[2] });
    }
    console.log(`res:`, res);
  }

  proceedOrder = async () => {
    try {
      const res = await post("/order/finish");
      if (res.ok) {
        this.props.history.push("/success-order");
      } else {
        alert("There was an error placing your order");
      }
    } catch (e) {
      alert("There was an error placing your order");
    }
  };

  render() {
    const cart = this.state.order;
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column width={5}></Grid.Column>
          <Grid.Column width={11}>
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
                  console.log(product);
                  return (
                    <Segment>
                      <Grid>
                        <Grid.Row columns={5} className="cart-product-row">
                          <Grid.Column>
                            <div style={{ width: "70px", height: "70px" }}>
                              <Image
                                src={product.productImage}
                                size="tiny"
                                verticalAlign="top"
                              />
                            </div>
                          </Grid.Column>

                          <Grid.Column>{product.productName}</Grid.Column>
                          <Grid.Column style={{ alignItems: "center" }}>
                            <Container>
                              <div className="cart-item-price">
                                {" "}
                                {product.orderedPrice} лв
                              </div>
                            </Container>
                          </Grid.Column>

                          <Grid.Column>{product.stock}</Grid.Column>
                          <Grid.Column style={{ alignItems: "center" }}>
                              <div className="cart-item-price">
                                {" "}
                                {parseFloat(product.productTotal).toFixed(2)} лв
                              </div>
                          </Grid.Column>
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
                  <Grid.Column >Тотал: </Grid.Column>
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
                    <Button onClick={this.proceedOrder}>Завърши</Button>
                  </Grid.Column>
                  <Divider />
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Checkout);
