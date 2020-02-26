import React, { Component } from "react";
import { Divider, Loader } from "semantic-ui-react";
import {
  Route,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";
import Cart from "../Cart";
import Profile from "../Profile";
import ForgotPassword from "../ForgotPassword";
import RestorePassword from "../RestorePassword";
import Order from "../Order";
import VerifiedEmail from "../VerifiedEmail";
import ProductPage from "../ProductPage";
import Checkout from "../Checkout";

import "react-notifications/lib/notifications.css";
import SuccessOrderScreen from "../SuccessOrderScreen";
import Maintance from "../Maintance";

const get = require("../../helpers/fetch").get;

class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: true,
      user: null,
      authenticating: true,
      online: false
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const online = await get("/status/get-status");
    if (!online.ok) {
      this.setState({ online: false });
    } else {
      this.setState({ online: true });
    }
    this.setState({ loading: false });
    const res = await get("/get-sess-info/user");
    if (res.ok) {
      const user = (await res.json()).user;
      this.setState({ user: user, authenticating: false });
    } else {
      this.setState({ authenticating: false });
    }
  }

  render() {
    const user = this.state.user;
    const authenticating = this.state.authenticating;
    if (!this.state.loading)
      return (
        <div style={{ paddingLeft: "30px" }}>
          {this.state.online ? (
            <div>
              <Head user={user} authenticating={authenticating} />
              <Divider />
              <NotificationContainer />
              <Switch style={{ minHeight: "80vh!important" }}>
                <Route exact path="/cart" component={Cart} />
                <Route exact path="/order" component={Order} />
                <Route exact path="/checkout" component={Checkout} />
                <Route exact path="/product/:id" component={ProductPage} />
                <Route exact path="/success-order" component={SuccessOrderScreen} />
                <Route exact path="/profile" component={Profile} user={user} />
                <Route exact path="/verify-email/:token" component={VerifiedEmail} user={user} />
                <Route
                  exact
                  path="/forgotpassword"
                  component={ForgotPassword}
                />
                <Route
                  exact
                  path="/restorepassword/:token"
                  component={RestorePassword}
                />

                <Route path="/:category/page/:page" component={Body} />
                <Redirect exact from="/" to="/All/page/0" component={Body} />
                <Redirect from="/:category" to="/:category/page/0" component={Body} />
              </Switch>
              <Footer />
            </div>
          ) : (
              <Maintance></Maintance>
            )}
        </div>
      );
    else {
      return <Loader></Loader>;
    }
  }
}

export default withRouter(Client);
