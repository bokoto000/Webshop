import React from "react";
import {
  Grid,
  Form,
  Image,
  Segment,
  Divider,
  Header,
  Button,
  Card,
  Tab,
  Table
} from "semantic-ui-react";

import _ from "lodash";
import { Redirect } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ProductCard from "../ProductCard";
import "./index.css";

const get = require("../../helpers/fetch").get;

const initialState = { isLoading: false, results: [], value: "" };

export default class ProductDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      perPage: 25,
      pageCount: 25,
      page: 0
    };
  }

  async componentDidMount() {
    const products = (await (await get("/product/get-products")).json())
      .products;

    this.setState({ products,originalProducts:products });
    const pageCount = products.length / this.state.perPage;
    this.setState({ pageCount });
  }

  pageFilterProducts() {
    const originalProducts = this.state.products;
    const page = this.state.page;
    const perPage = this.state.perPage;
    const productsLength = originalProducts.length;
    let products = [];
    for (let i = page * perPage; i < (page + 1) * perPage; i++) {
      if (originalProducts[i]) products.push(originalProducts[i]);
    }
    return products;
  }

  handlePageClick = data => {
    let selected = data.selected;
    this.setState({ page: selected });
  };

  handleFormSubmit = () => {
    console.log("search:", this.state.query);
  };

  handleInputChange = e => {
    this.setState({
      query: e.target.value
    });
    this.setState({ isLoading: true, value:e.target.value });
    console.log(e.target.value);

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.name);
      this.setState({
        isLoading: false,
        products: _.filter(this.state.originalProducts, isMatch).slice(0, 9)
      });
    }, 300);
  };

  render() {
    const products = this.pageFilterProducts();
    return (
      <div style={{ width: "100%" }}>
        <Form onSubmit={this.handleFormSubmit}>
          <Form.Input
            placeholder="Search..."
            value={this.state.query}
            onChange={this.handleInputChange}
          />
        </Form>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Име</Table.HeaderCell>
              <Table.HeaderCell>Цена</Table.HeaderCell>
              <Table.HeaderCell>Наличност</Table.HeaderCell>
              <Table.HeaderCell>Промяна</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products.map(product => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  tags={this.props.tags}
                />
              );
            })}
          </Table.Body>
        </Table>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pagination-item"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}
