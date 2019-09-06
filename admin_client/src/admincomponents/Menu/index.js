import React from "react";
import { Route, Switch, withRouter, BrowserRouter } from "react-router-dom";
import { Grid, Table, Button } from "semantic-ui-react";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";
import ProductForm from "../ProductForm";
import ProductDisplay from "../ProductDisplay";
import TagForm from "../TagForm";
import "./index.css";
import PendingOrders from "../PendingOrders";

const post = require("../../helpers/fetch").post;
const get = require("../../helpers/fetch").get;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      path: "",
      activeItem: null
    };
  }

  async componentDidMount() {
    const tags = (await (await get("/tag/get-tags")).json()).tags;
    this.setState({ tags });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  async handleLogOut() {
    const res = await post("/admin/logout");
    if (res.ok) {
      window.location.reload();
    }
  }

  redirect = path => {
    console.log(path);
    this.setState({ path });
  };

  render() {
    return (
      <div>
        <Grid>
          <Grid.Column>
            <Table>
              <Table.Body>
                <Table.Row onClick={() => this.redirect("products")}>
                  <Table.Cell>Продукти</Table.Cell>
                </Table.Row>
                <Table.Row onClick={() => this.redirect("create-product")}>
                  <Table.Cell>Направи продукт</Table.Cell>
                </Table.Row>
                <Table.Row onClick={() => this.redirect("create-tag")}>
                  <Table.Cell>Тагове</Table.Cell>
                </Table.Row>
                <Table.Row onClick={() => this.redirect("orders")}>
                  <Table.Cell>Поръчки</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column className="body">
            {this.state.path == "" || this.state.path == "products" ? (
              <ProductDisplay tags={this.state.tags}></ProductDisplay>
            ) : null}
            {this.state.path == "create-product" ? (
              <ProductForm></ProductForm>
            ) : null}
            {this.state.path == "create-tag" ? (
              <TagForm tags={this.state.tags}></TagForm>
            ) : null}
            {this.state.path == "orders" ? (
              <PendingOrders></PendingOrders>
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(Menu);
