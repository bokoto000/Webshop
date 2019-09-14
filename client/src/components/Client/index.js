import React, { Component } from "react";
import { Divider } from "semantic-ui-react";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import Menu from "../Menu";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";
import Cart from "../Cart";
import Profile from "../Profile";
import ForgotPassword from "../ForgotPassword";
import RestorePassword from "../RestorePassword";
import Order from "../Order";
import Checkout from "../Checkout";

import "react-notifications/lib/notifications.css";
import SuccessOrderScreen from "../SuccessOrderScreen";

const get = require("../../helpers/fetch").get;

class Client extends Component {
  constructor(props) {
    super(props);
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
        <NotificationContainer />
        <Switch style ={{minHeight: "80vh"}}>
          <Route exact path="/" component={Body} />
          <Route exact path="/cart" component={Cart} />
          <Route path="/order" component={Order} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/success-order" component={SuccessOrderScreen} />
          <Route exact path="/profile" component={Profile} user={user} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />
          <Route path="/restorepassword/:token" component={RestorePassword} />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default Client;
