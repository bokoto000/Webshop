import React, { Component } from "react";
import {
  Grid,
  Form,
  Radio,
  Button,
  Label,
  Table,
  Header
} from "semantic-ui-react";
import DownloadProducts from "./../DownloadExcel/DownloadProducts";
import _ from "lodash";
import DatePicker from "react-datepicker";
import queryString from "query-string";
import ReactExport from "react-export-excel";

const get = require("../../../helpers/fetch").get;
const ExcelFile = ReactExport.ExcelFile;

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date()
    };
  }

  handleChangeStart = date => {
    this.setState({
      startDate: date
    });
  };
  handleChangeEnd = date => {
    this.setState({
      endDate: date
    });
  };

  onSubmit = async () => {
    const values = queryString.parse(this.props.location.search);
    const startDate = new Date(this.state.startDate);
    const endDate = new Date(this.state.endDate);
    const start_date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const end_date = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23,
      59,
      59
    );
    if (startDate > endDate) {
      alert("Началната дата е след крайната");
      return;
    }
    const res = await get(
      `/enquery/products/${start_date.getTime()}/${end_date.getTime()}`
    );
    const data = await res.json();
    if (data) {
      this.setState({
        products: data.productsArr,
        originalProducts: data.productsArr
      });
    }
  };

  async componentDidMount() {
  }

  handleInputCodeChange = e => {
    this.setState({ isLoading: true, value: e.target.value });
    const value = e.target.value;
    if (value.length < 1) return this.setState({ products: this.state.originalProducts });
    const re = new RegExp(_.escapeRegExp(value), "i");
    const isMatch = result => re.test(result.id);
    const products = _.filter(this.state.originalProducts, isMatch);
    const pageCount = products.length / this.state.perPage;
    this.setState({
      isLoading: false,
      products,
      pageCount
    });
  };

  render() {
    const products = this.state.products;
    return (
      <div>
        <Header>Справка продукти:</Header>
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
          </Form.Group>

          <Form.Group inline>
            <Form.Field fluid control={Button}>
              Направи справка
            </Form.Field>
          </Form.Group>
        </Form>

        <Form onSubmit={this.handleFormSubmit}>
          <Form.Input
            placeholder="Search by id..."
            value={this.state.queryCode}
            onChange={this.handleInputCodeChange}
          />
          <ExcelFile element={<Button>Download Data</Button>}>{DownloadProducts(products)}</ExcelFile>
        </Form>
        <Table>
          <Table.Header>
            <Table.HeaderCell>Име</Table.HeaderCell>
            <Table.HeaderCell>Код</Table.HeaderCell>
            <Table.HeaderCell>Наличност</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {products && products.length > 0
              ? products.map(product => {
                return (
                  <Table.Row>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.id}</Table.Cell>
                    <Table.Cell>-{product.stock}</Table.Cell>
                  </Table.Row>
                );
              })
              : null}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
