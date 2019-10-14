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

import TimePicker from "react-time-picker";
import DatePicker from "react-datepicker";
import queryString from "query-string";
import downloadOrders from "./../DownloadExcel/DownloadOrders";
import ReactExport from "react-export-excel";
import { get } from "../../../helpers/fetch";



const ExcelFile = ReactExport.ExcelFile;
let hourDropdown = [];
const options = [
  { key: 1, text: "Sent", value: "Sent" },
  { key: 2, text: "Verified", value: "Verified" },
  { key: 3, text: "Canceled", value: "Canceled" }
];

for (let i = 0; i <= 24; i++) {
  hourDropdown.push({ id: i, value: i, text: i + ":00" });
}
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

  handleChangePrice = async (e, { name, value }) => {
    this.setSearchParams(name, value);
    this.setState({ [name]: value });
  };

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

    this.setSearchParams(name, value);
    this.setState({ [name]: value });
  };

  onSubmit() {
    const values = queryString.parse(this.props.location.search),
      higherprice = this.state.higherprice,
      lowerprice = this.state.lowerprice;
    if (this.state.startDate && this.state.endDate && this.state.startHour >= 0 && this.state.endHour >= 0) {
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
    } else {
      alert("Изберете дати и часове");
    }
  }

  handleChange = (e, { name, value }) => {
    this.getOrders(value);
  };

  resetFilters = () => {
    this.setState({ loading: true });
    let values = queryString.parse(this.props.location.search);
    this.props.history.push({
      search: ""
    });
    this.setState({
      startDate: null,
      endDate: null,
      startHour: null,
      endHour: null
    });
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
    if (
      startDate &&
      endDate &&
      startHour >= 0 &&
      endHour >= 0
    ) {
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
  }

  render() {
    const orders = this.filterOrders();

    const values = queryString.parse(this.props.location.search);
    return (
      <div>
        <Header>Справка поръчки:</Header>
        <Grid>
          <Grid.Row columns={2}>
            <label style={{ marginBottom: "auto", marginTop: "auto" }}>
              Status:
            </label>
            <Dropdown
              selection
              name="default"
              options={options}
              placeholder="Status"
              onChange={this.handleChange}
            />
          </Grid.Row>
          <Grid.Row>
            <Form>
              <Segment.Inline>
                <Form.Field>
                  <Input
                    className="price-box"
                    placeholder={
                      values.lowerprice >= 0
                        ? values.lowerprice
                        : "от тотал на поръчката"
                    }
                    name="lowerprice"
                    type="number"
                    min={0}
                    onChange={this.handleChangePrice}
                    value={values.lowerprice}
                  />
                  <Input
                    className="price-box"
                    placeholder={
                      values.higherprice >= 0
                        ? values.higherprice
                        : "до тотал на поръчката"
                    }
                    name="higherprice"
                    type="number"
                    min={0}
                    onChange={this.handleChangePrice}
                    value={values.higherprice}
                  />
                </Form.Field>
              </Segment.Inline>
            </Form>
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
                  value={this.state.startHour ? this.state.startHour : values["start_hour"]}
                  onChange={this.handleHourChange}
                  options={hourDropdown}
                ></Dropdown>
                <Dropdown
                  search
                  selection
                  name="endHour"
                  value={this.state.endHour ? this.state.endHour : values["end_hour"]}
                  onChange={this.handleHourChange}
                  options={hourDropdown}
                ></Dropdown>
                <Form.Field fluid control={Button}>
                  Търси
                </Form.Field>
              </Form.Group>
            </Form>
            <Button onClick={() => this.resetFilters()}>Изтрий филтрите</Button>

            <ExcelFile element={<Button>Download Data</Button>}>{downloadOrders(orders)}</ExcelFile>
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
