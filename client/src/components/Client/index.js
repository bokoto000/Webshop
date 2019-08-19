import React, { Component } from "react";
import { Divider } from "semantic-ui-react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import Menu from "../Menu";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";
import Cart from "../Cart";
const get = require("../../helpers/fetch").get;

class Client extends Component {
  constructor() {
    super();
    this.state = {
      isAuth: true,
      user: null,
      authenticating: true
    };
  }

  async componentDidMount() {
    const res = await get("get-sess-info/user");
    if (res.ok) {
      const user = (await res.json()).user;
      this.setState({ isAuth: true, user: user, authenticating: false });
    } else {
      this.setState({ isAuth: false, authenticating: false });
    }
  }

  render() {
    const isAuth = this.state.isAuth;
    const user = this.state.user;
    const authenticating = this.state.authenticating;
    return (
      <div style={{ paddingLeft: "30px" }}>
        <Head user={user} authenticating={authenticating} />
        <Divider />
        <Switch>
          <Route exact path="/" component={Body} />
          <Route exact path="/cart" component={Cart} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Client;
