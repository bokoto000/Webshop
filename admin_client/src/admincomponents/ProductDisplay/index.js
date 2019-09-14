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
import { Redirect } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ProductCard from "../ProductCard";
import "./index.css";

const get = require("../../helpers/fetch").get;

export default class ProductDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      perPage: 25,
      pageCount: 25,
      page: 0,
    };
  }

  async componentDidMount() {
    const products = (await (await get("/product/get-products")).json())
      .products;
    this.setState({ products });
    const pageCount = products.length / this.state.perPage;
    this.setState({pageCount});
  }

  pageFilterProducts() {
    const originalProducts = this.state.products;
    const page = this.state.page;
    const perPage = this.state.perPage;
    const productsLength = originalProducts.length;
    let products = [];
    console.log(productsLength);
    for (let i = page * perPage; i < (page + 1) * perPage; i++) {
      console.log(originalProducts[i]);
      if (originalProducts[i]) products.push(originalProducts[i]);
    }
    return products;
  }

  handlePageClick = data => {
    let selected = data.selected;
    console.log(selected);
    this.setState({ page: selected });
  };

  render() {
    const products = this.pageFilterProducts();
    return (
      <div style={{ width: "100%" }}>
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
