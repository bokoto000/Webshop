import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ProductDisplay from "../ProductDisplay";
import ProductForm from "../ProductForm";
import TagForm from "../TagForm";
import PendingOrders from "../PendingOrder";
import { Header } from "semantic-ui-react";

const post = require("../../helpers/fetch").post;
const get = require("../../helpers/fetch").get;

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
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

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route
              exact
              path="/products"
              render={
                <ProductDisplay tags={this.state.tags} />
              }
            />
            <Route path="/create-product" render={props => <ProductForm />} />
            <Route
              path="/create-tag"
              render={props => <TagForm tags={this.state.tags} />}
            />
            <Route path="/orders" component={PendingOrders} />
            <ProductDisplay tags={this.state.tags} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
