import React, { Component } from "react";
import {
  Grid,
  Table,
  Button,
  Form,
  Dropdown,
  Header,
  Segment,
  Input,
  Icon
} from "semantic-ui-react";
import Order from "./Order";
import queryString from "query-string";
import ReactExport from "react-export-excel";
import { get } from "../../../helpers/fetch";
import downloadOrders from "./../DownloadExcel/DownloadOrders";
import DateIntervalPicker from "./DateIntervalPicker";
import HourIntervalPicker from "./HourIntervalPicker";
import PriceIntervalPicker from "./PriceIntervalPicker";
import StatusPicker from "./StatusPicker";
import GroupByPicker from "../GroupByPicker";

const ExcelFile = ReactExport.ExcelFile;

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originalOrders: []
    };
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

  testEnquery = async () => {
    const values = queryString.parse(this.props.location.search);
    const res = await get(
      `/enquery/orders/?${new URLSearchParams(values).toString()}`
    );
    if (res.ok) {
      const orders = await res.json();
      console.log(orders);
    }
  };

  onSubmit = async () => {
    const values = queryString.parse(this.props.location.search),
      higherprice = this.state.higherprice,
      lowerprice = this.state.lowerprice;
    if (
      this.state.startDate &&
      this.state.endDate &&
      this.state.startHour >= 0 &&
      this.state.endHour >= 0
    ) {
      const startDate = this.state.startDate.getTime(),
        endDate = this.state.endDate.getTime(),
        startHour = this.state.startHour,
        endHour = this.state.endHour;
      values["start_date"] = startDate;
      values["end_date"] = endDate;
      values["start_hour"] = startHour;
      values["end_hour"] = endHour;
      if (higherprice >= 0 && lowerprice >= 0) {
        values["higherprice"] = higherprice;
        values["loweprice"] = higherprice;
      }
      this.props.history.push({
        search: "?" + new URLSearchParams(values).toString()
      });
      const res = await get(
        `/enquery/orders/?${new URLSearchParams(values).toString()}`
      );
      if (res.ok) {
        const orders = await res.json();
        console.log(orders);
      }
    } else {
      alert("Изберете дати и часове");
    }
  };

  resetFilters = () => {
    this.setState({ loading: true });
    let values = queryString.parse(this.props.location.search);
    this.props.history.push({
      search: ""
    });
    this.setState({ clearFilters: !this.state.clearFilters });
    this.setState({ loading: false });
  };

  setSearchParams(name, value) {
    let values = queryString.parse(this.props.location.search);
    values[name] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
  }

  filterOrders = () => {
    let orders = [];
    const values = queryString.parse(this.props.location.search);
    const higherprice = values["higherprice"],
      lowerprice = values["lowerprice"];
    const startDate = values["start_date"];
    const endDate = values["end_date"];
    const startHour = values["start_hour"];
    const endHour = values["end_hour"];
    if (startDate && endDate && startHour >= 0 && endHour >= 0) {
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
          if (higherprice >= 0 && lowerprice >= 0) {
            if (order.total >= lowerprice && order.total <= higherprice)
              orders.push(order);
          } else {
            orders.push(order);
          }
        }
      }
    }
    return orders;
  };

  render() {
    const orders = this.filterOrders();

    const values = queryString.parse(this.props.location.search);
    return (
      <div>
        <Header>Справка поръчки:</Header>
        <Grid>
          <Button onClick={this.testEnquery}></Button>
          <Grid.Row columns={2}>
            <StatusPicker {...this.props}></StatusPicker>
          </Grid.Row>
          <Grid.Row>
            <GroupByPicker {...this.props}></GroupByPicker>
          </Grid.Row>
          <Grid.Row>
            <PriceIntervalPicker
              clearFilters={this.state.clearFilters}
              {...this.props}
            ></PriceIntervalPicker>
          </Grid.Row>
          <Grid.Row>
            <DateIntervalPicker {...this.props}></DateIntervalPicker>
            <HourIntervalPicker {...this.props}></HourIntervalPicker>
            <Form onSubmit={this.onSubmit}>
              <Form.Group inline>
                <Form.Field fluid control={Button}>
                  Търси
                </Form.Field>
              </Form.Group>
            </Form>
            <Button onClick={() => this.resetFilters()}>Изтрий филтрите</Button>

            <ExcelFile element={<Button>Download Data</Button>}>
              {downloadOrders(orders)}
            </ExcelFile>
          </Grid.Row>
          <Grid.Row>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Потребител</Table.HeaderCell>
                  <Table.HeaderCell>Статус</Table.HeaderCell>
                  <Table.HeaderCell>Дата</Table.HeaderCell>
                  <Table.HeaderCell>Продукти</Table.HeaderCell>
                  <Table.HeaderCell>Общо</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {orders
                  ? orders.map(order => {
                      return <Order key={order.id} order={order}></Order>;
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
