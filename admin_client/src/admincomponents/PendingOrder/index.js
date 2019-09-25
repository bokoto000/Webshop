import React, { Component } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Header,
  Grid,
  Divider,
  Segment,
  Container
} from "semantic-ui-react";
import { post } from "../../helpers/fetch";
import "./index.css";

export default class PendingOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  proceedOrder = async id => {
    console.log(id);
    if (id) {
      const res = await post(`/order/update-status/Verified`, {
        orderId: id
      });
      if (res) {
        window.location.reload();
      } else {
        alert("Error verifying orsder");
      }
    } else {
      console.log("problem");
    }
  };
  cancelOrder = async id => {
    console.log(id);
    if (id) {
      const res = await post(`/order/update-status/Canceled`, {
        orderId: id
      });
      if (res) {
        window.location.reload();
      } else {
        alert("Error verifying order");
      }
    } else {
      console.log("problem");
    }
  };
  


  render() {
    const order = this.props.order;
    let date = new Date ;
    date.setTime(order.date);
    date.toLocaleString('en-US', { timeZone: 'Europe/Sofia' })
    const hours = date.getHours()+3;
    const transformedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      date.getMinutes()
    );
    return (
      <Table.Row>
        <Table.Cell>
          {order && order.user ? order.user.username : null}
        </Table.Cell>
        <Table.Cell>{order.status}</Table.Cell>
        <Table.Cell>{transformedDate.toUTCString()}{"+02:00"}</Table.Cell>
        <Table.Cell>
          <Modal trigger={<Button>Виж</Button>}>
            <Modal.Header>Order: {order.id}</Modal.Header>
            <Modal.Content>
              <div>
                <Grid>
                  <Grid.Column>
                    <Grid>
                      <Grid.Row columns={5} className="cart-product-row">
                        <Grid.Column />

                        <Grid.Column>Име</Grid.Column>

                        <Grid.Column>Цена/бр</Grid.Column>

                        <Grid.Column>Количество</Grid.Column>

                        <Grid.Column>Общо</Grid.Column>
                      </Grid.Row>
                    </Grid>
                    {order.fullOrder
                      ? order.fullOrder.map(product => {
                          return (
                            <Segment key={product.productId}>
                              <Grid>
                                <Grid.Row
                                  columns={5}
                                  className="cart-product-row"
                                >
                                  <Grid.Column>
                                    <div
                                      style={{ width: "70px", height: "70px" }}
                                    >
                                      <Image
                                        src={product.productImage}
                                        size="tiny"
                                        verticalAlign="top"
                                      />
                                    </div>
                                  </Grid.Column>

                                  <Grid.Column>
                                    {product.productName}
                                    <br></br>
                                    Код:{product.productId}
                                  </Grid.Column>
                                  <Grid.Column style={{ alignItems: "center" }}>
                                    <div className="cart-item-price">
                                      {parseFloat(product.orderedPrice).toFixed(
                                        2
                                      )}
                                      лв
                                    </div>
                                  </Grid.Column>

                                  <Grid.Column>{product.stock}</Grid.Column>
                                  <Grid.Column style={{ alignItems: "center" }}>
                                    <div className="cart-item-price">
                                      {parseFloat(product.productTotal).toFixed(
                                        2
                                      )}
                                      лв
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
                          <Grid.Column />
                          <Grid.Column style={{ alignItems: "center" }}>
                            <div className="cart-item-price">
                              {" "}
                              {parseFloat(order.total).toFixed(2)} лв
                            </div>
                          </Grid.Column>
                          <Divider />
                        </Grid.Row>
                        <Grid.Row columns={2} className="cart-product-row">
                          <Grid.Column>
                            <Segment>
                              <Container>
                                {order.user ? order.user.first_name : null}
                              </Container>
                              <Container>
                                {order.user ? order.user.last_name : null}
                              </Container>
                            </Segment>
                          </Grid.Column>

                          <Grid.Column>
                            <Button
                              onClick={() =>
                                this.proceedOrder(this.props.order.id)
                              }
                            >
                              Завърши
                            </Button>
                            <Button
                              onClick={() =>
                                this.cancelOrder(this.props.order.id)
                              }
                            >
                              Откажи
                            </Button>
                          </Grid.Column>
                          <Divider />
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  </Grid.Column>
                </Grid>
              </div>
            </Modal.Content>
          </Modal>
        </Table.Cell>
      </Table.Row>
    );
  }
}
