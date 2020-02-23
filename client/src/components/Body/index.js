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
    this.refresh = this.refresh.bind(this); 
  }

  async getProducts(){
    this.setState({loading:true});
    let values = await queryString.parse(this.props.location.search);
    values.page=this.props.match.params.page;
    values.category=this.props.match.params.category;
    let stringifiedValues = await queryString.stringify(values);
    console.log(stringifiedValues);
    const res = await get(`/product/get-products/?${stringifiedValues}`);
    let products = (await res.json()).products;
    this.setState({ products, allProducts: products });
    this.setState({loading:false});
  }

  async componentDidMount() {
    await this.getProducts();
    if (this.props.history.action === "POP") {
       await this.getProducts();
      }
  }

  async componentDidUpdate(){
    //if (this.props.history.action === "POP") {
    //  await this.getProducts();
    //}
  }


  async refresh(){
    const refresh = this.state.refresh;
    //console.log(refresh);
    await this.getProducts();
    this.setState({refresh:!refresh});
  }

  setTag = async (tag) =>  {
    const products = this.state.allProducts;
    return this.props.history.push(`/${tag}`);
    if (tag == "All") {
      this.setState({ products });
    } else {
      let newProducts = [];
      for (let i = 0; i < products.length; i++) {
        if (products[i].tags)
          for (let j = 0; j < products[i].tags.length; j++) {
            if (products[i].tags[j].name == tag) {
              newProducts.push(products[i]);
              break;
            }
          }
      }
      this.setState({ products: newProducts });
    }

  }

  render() {
    if(!this.state.loading)
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
                <ProductDisplay refresh={this.refresh} products={this.state.products} />
              ) :null}
              <Pagination refresh={this.refresh}></Pagination>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
    else  {
      return <div>
        <Loader active>

        </Loader>
      </div>
    }
  }
}

export default withRouter(Body);