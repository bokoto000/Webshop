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
import "./index.css";

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const order = this.props.order;
    let date = new Date();
    date.setTime(order.date);
    date.toLocaleString("en-US", { timeZone: "Europe/Sofia" });
    const hours = date.getHours() + 3;
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
        <Table.Cell>
          {transformedDate.toUTCString()}
          {"+02:00"}
        </Table.Cell>
        <Table.Cell>
          {order.fullOrder
            ? order.fullOrder.map(product => {
                return (
                  <div>
                    {product.productName}
                    (Код:{product.productId}){" "}
                    {parseFloat(product.orderedPrice).toFixed(2)}
                    лв{" x "} {product.stock}
                    {"Общо: "}
                      {parseFloat(product.productTotal).toFixed(2)}
                      лв
                  </div>
                );
              })
            : null}
        </Table.Cell>
        <Table.Cell>
          <div className="cart-item-price">
            {" "}
            {parseFloat(order.total).toFixed(2)} лв
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }
}
