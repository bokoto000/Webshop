import React, { Component } from "react";
import { Grid, Table, Button } from "semantic-ui-react";
import PendingOrder from "../PendingOrder";
import { get } from "../../helpers/fetch";

export default class PendingOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const res = await (await get("/order/get-all/Sent")).json();
    if (res.length > 0) {
      this.setState({ orders: res });
    }
  }

  async getOrders(status) {
    const res = await (await get(`/order/get-all/${status}`)).json();
    if (res.length > 0) {
      this.setState({ orders: res });
    } else {
      this.setState({ orders: [] });
    }
  }

  render() {
    const orders = this.state.orders;
    return (
      <div style={{ height: "80vh", width: "100%" }}>
        <Grid>
          <Grid.Row columns={2}>
            <Button onClick={() => this.getOrders("Sent")}>Pending</Button>
            <Button onClick={() => this.getOrders("Verified")}>Verified</Button>
          </Grid.Row>
          <Grid.Row>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Потребител</Table.HeaderCell>
                  <Table.HeaderCell>Статус</Table.HeaderCell>
                  <Table.HeaderCell>Действие</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orders
                  ? orders.map(order => {
                      return (
                        <PendingOrder
                          key={order.id}
                          order={order}
                        ></PendingOrder>
                      );
                    })
                  : null}
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
