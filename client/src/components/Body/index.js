import React, { Component } from "react";
import { Grid, Table, Loader } from "semantic-ui-react";
import ProductDisplay from "../ProductDisplay";
import Menu from "../Menu";
import ProductsFilters from "../ProductsFilters";
import Pagination from "../Pagination";
import filters from "../../helpers/filters";

import queryString from "query-string";
import { withRouter, useParams, Link, Redirect } from "react-router-dom";
const get = require("../../helpers/fetch").get;


class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      tag: "All",
      refresh:0
    };
    //this.refresh = this.refresh.bind(this); 
  }

  async getProducts(){
    let values = await queryString.parse(this.props.location.search);
    values.page=this.props.match.params.page;
    values.category=this.props.match.params.category;
    let stringifiedValues = await queryString.stringify(values);
    const res = await (await get(`/product/get-products/?${stringifiedValues}`)).json();
    let products = res.products;
    let pagesCount = res.pagesCount;
    console.log(pagesCount);
    this.setState({ products, allProducts: products, pagesCount});
  }

  async componentDidMount() {
    await this.getProducts();
  }

  async componentDidUpdate(prevProps) {
    const prevParams = await JSON.stringify(prevProps.match.params);
    const currParams = await JSON.stringify(this.props.match.params);
    if(prevParams!=currParams) {
      await this.getProducts();
    }
  }

  setTag = async (tag) =>  {
    const products = this.state.allProducts;
    return this.props.history.push(`/${tag}`);
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={2}>
              {" "}
              <div>
                <Table color="blue" inverted selectable>
                  <Table.Header>
                      <Table.Row onClick={() => this.setTag("All")}>
                        <Table.HeaderCell>Продукти</Table.HeaderCell>
                      </Table.Row>
                  </Table.Header>

                  <Table.Body>
                      <Table.Row  to="/Laptop" onClick={() => this.setTag("Laptop")}>
                        <Table.Cell>Лаптопи</Table.Cell>
                      </Table.Row>
                    <Table.Row onClick={() => this.setTag("Phone")}>
                      <Table.Cell>Телефони</Table.Cell>
                    </Table.Row>
                    <Table.Row onClick={() => this.setTag("PC")}>
                      <Table.Cell>Компютри
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row onClick={() => this.setTag("Accessory")}>
                      <Table.Cell>Аксесоари</Table.Cell>
                    </Table.Row>
                     <Table.Row onClick={() => this.setTag("Monitor")}>
                      <Table.Cell>Монитори</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column width={12}>
              <ProductsFilters refresh={this.refresh}></ProductsFilters>
              {this.state.products ? ( 
                <ProductDisplay loading={this.state.products} products={this.state.products} />
              ) :null}
              <Pagination pagesCount={this.state.pagesCount} refresh={this.refresh}></Pagination>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Body);