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
import Enquery from "../Enquery";
import Permissions from "../Permissions";
import PendingOrders from "../PendingOrders";
import EditUser from "../EditUser";
import "./index.css";
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

  async componentDidMount() {
    const tags = (await (await get(`/tag/get-tags`)).json()).tags;
    this.setState({ tags });
  }

  render() {
    return (
      <div>
        <Head></Head>
        <Grid style={{ minHeight: "80vh" }}>
          <Grid.Row>
            <Grid.Column width={3}>
              <Menu />
            </Grid.Column>
            <Grid.Column width={12}>
              <Switch style={{ minHeight: "80vh" }}>
                <Route
                  exact
                  path="/"
                  render={props => (
                    <ProductDisplay {...props} tags={this.state.tags} />
                  )}
                />
                <Route exact path="/create-product" component={ProductForm} />
                <Route
                  exact
                  path="/create-tag"
                  render={props => (
                    <TagForm {...props} tags={this.state.tags} />
                  )}
                />
                <Route exact path="/orders" component={PendingOrders} />
                <Route path="/enquery" component={Enquery} />
                <Route path="/permissions" component={Permissions} />
                <Route path="/admin/edit-user/:id" component={EditUser} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}
