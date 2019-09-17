import React from "react";

import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import Menu from "../Menu";
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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      activeItem: null
    };
  }

  render() {
    return (
      <div>
        <Head></Head>
        <Grid style={{ minHeight: "80vh" }}>
          <Grid.Row>
            <Grid.Column>
              <Menu />
            </Grid.Column>
            <Grid.Column>
              <Switch style={{ minHeight: "80vh" }}>
                <Route exact path="/" component={ProductDisplay} />
                <Route exact path="/create-product" component={ProductForm} />
                <Route exact path="/create-tag" component={TagForm} />
                <Route exact path="/orders" component={PendingOrders} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}
