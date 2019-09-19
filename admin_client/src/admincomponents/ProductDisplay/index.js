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
  Loader,
  Table
} from "semantic-ui-react";

import _ from "lodash";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import ReactPaginate from "react-paginate";
import ProductCard from "../ProductCard";

import filters from "../../helpers/filters";
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

    this.setState({ products, originalProducts: products });
    const pageCount = products.length / this.state.perPage;
    this.setState({ pageCount });
  }

  pageFilterProducts() {
    const originalProducts = this.sort(this.state.products);
    const page = this.state.page;
    const perPage = this.state.perPage;
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
    this.setState({ isLoading: true, value: e.target.value });
    console.log(e.target.value);
    const value = e.target.value;
    if (value.length < 1) return this.setState(initialState);
    const re = new RegExp(_.escapeRegExp(value), "i");
    const isMatch = result => re.test(result.name);
    const products = _.filter(this.state.originalProducts, isMatch);
    const pageCount = products.length / this.state.perPage;
    this.setState({
      isLoading: false,
      products,
      pageCount
    });
  };

  sort(products) {
    const values = queryString.parse(this.props.location.search);
    const sort = values.sort;
    const sortDir = values.sortDir;
    if (sort == "name") {
      if (sortDir == "true") {
        return filters.sortNameAZ(products);
      } else {
        return filters.sortNameZA(products);
      }
    }
    if (sort == "price") {
      if (sortDir == "true") {
        return filters.sortLowestPrice(products);
      } else {
        return filters.sortHighestPrice(products);
      }
    }
    if (sort == "stock") {
      if (sortDir == "true") {
        return filters.sortStockUp(products);
      } else {
        return filters.sortStockDown(products);
      }
    }
    return products;
  }

  setSort = type => {
    let values = queryString.parse(this.props.location.search);
    values["sort"] = type;
    const dir = values["sortDir"];
    if (dir == "false" || dir == "true") {
      if (dir == "true") values["sortDir"] = false;
      else values["sortDir"] = true;
    } else values["sortDir"] = true;

    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
  };

  render() {
    const products = this.pageFilterProducts();
    const isLoading = this.state.isLoading;
    if (!isLoading)
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
                <Table.HeaderCell
                  width={4}
                  onClick={() => this.setSort("name")}
                >
                  Име
                </Table.HeaderCell>
                <Table.HeaderCell
                  width={4}
                  onClick={() => this.setSort("price")}
                >
                  Цена
                </Table.HeaderCell>
                <Table.HeaderCell
                  width={3}
                  onClick={() => this.setSort("stock")}
                >
                  Наличност
                </Table.HeaderCell>
                <Table.HeaderCell width={3}>Промяна</Table.HeaderCell>
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
    else {
      return <Loader></Loader>;
    }
  }
}
