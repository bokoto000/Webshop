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
import ProductCard from "../ProductCard";
import "./index.css";

const get = require("../../helpers/fetch").get;

export default class ProductDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    const products = (await (await get("/product/get-products")).json())
      .products;
    this.setState({ products });
  }

  render() {
    const products = this.state.products;
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
      </div>
    );
  }
}
