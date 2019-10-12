import React, { Component } from "react";
import { Grid, Table, Loader } from "semantic-ui-react";
import ProductDisplay from "../ProductDisplay";
import Menu from "../Menu";
import filters from "../../helpers/filters";

const get = require("../../helpers/fetch").get;

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: [],
      tag: "All"
    };
  }

  async componentDidMount() {
    this.setState({loading:true});
    this.setState({ products: [], allProducts: [] });
    const res = await get("/product/get-products");
    let products = (await res.json()).products;
    products = filters.filterNewest(products);
    this.setState({ products, allProducts: products });
    this.setState({loading:false});
  }

  setTag = async (tag) =>  {
    const products = this.state.allProducts;
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
                    <Table.Row onClick={() => this.setTag("Laptop")}>
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
              {this.state.products ? ( 
                <ProductDisplay products={this.state.products} />
              ) :null}
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
