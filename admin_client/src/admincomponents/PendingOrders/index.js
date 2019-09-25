import React, { Component } from "react";
import { Grid, Table, Button, Form, Dropdown } from "semantic-ui-react";
import PendingOrder from "../PendingOrder";

import TimePicker from "react-time-picker";
import DatePicker from "react-datepicker";
import { get } from "../../helpers/fetch";

var hourDropdown = [];
for (let i = 0; i <= 24; i++) {
  hourDropdown.push({ id: i, value: i, text: i + ":00" });
}

export default class PendingOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    const res = await (await get("/order/get-all/Sent")).json();
    if (res.length > 0) {
      this.setState({ orders: res, originalOrders: res });
    }
  }

  async getOrders(status) {
    const res = await (await get(`/order/get-all/${status}`)).json();
    if (res.length > 0) {
      this.setState({ orders: res, originalOrders: res });
    } else {
      this.setState({ orders: [] });
    }
  }

  handleChangeStart = date => {
    try {
      const startDate = date;
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      this.setState({
        startDate
      });
    } catch (e) {
      alert("Моля изберете валидна дата");
    }
  };

  handleChangeEnd = date => {
    try {
      const endDate = date;
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      this.setState({
        endDate
      });
    } catch (e) {
      alert("Моля изберете валидна дата");
    }
  };

  handleHourChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  onSubmit() {
    let orders = [];
    if (
      this.state.startDate &&
      this.state.endDate &&
      this.state.startHour >= 0 &&
      this.state.endHour >= 0
    ) {
      const startDate = this.state.startDate.getTime();
      const endDate = this.state.endDate.getTime();
      const startHour = this.state.startHour;
      const endHour = this.state.endHour;
      for (let i = 0; i < this.state.originalOrders.length; i++) {
        let order = this.state.originalOrders[i];
        let orderDate = new Date();
        let orderTime = parseInt(order.date);
        orderDate.setTime(orderTime);
        const orderHour = parseInt(orderDate.getHours());
        if (
          orderTime > startDate &&
          orderTime < endDate &&
          startHour <= orderHour &&
          orderHour < endHour
        ) {
          orders.push(order);
        }
      }
      this.setState({ orders });
    } else {
      alert("Изберете дати и часове");
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
            <Button onClick={() => this.getOrders("Canceled")}>Canceled</Button>
          </Grid.Row>
          <Grid.Row>
            <Form onSubmit={this.onSubmit}>
              <Form.Group inline>
                <Form.Field
                  label="от"
                  control={DatePicker}
                  selected={this.state.startDate}
                  onChange={this.handleChangeStart}
                ></Form.Field>
                <Form.Field
                  label="до"
                  control={DatePicker}
                  selected={this.state.endDate}
                  onChange={this.handleChangeEnd}
                ></Form.Field>
                Между:
                <Dropdown
                  search
                  selection
                  name="startHour"
                  onChange={this.handleHourChange}
                  options={hourDropdown}
                ></Dropdown>
                <Dropdown
                  search
                  selection
                  name="endHour"
                  onChange={this.handleHourChange}
                  options={hourDropdown}
                ></Dropdown>
                <Form.Field fluid control={Button}>
                  Търси
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Row>
          <Grid.Row>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Потребител</Table.HeaderCell>
                  <Table.HeaderCell>Статус</Table.HeaderCell>
                  <Table.HeaderCell>Дата</Table.HeaderCell>
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
