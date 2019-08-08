import React, { Component } from "react";
import { Grid, Divider } from "semantic-ui-react";
import Menu from "../Menu";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";


const get = require('../../helpers/fetch').get;


class Client extends Component {
  constructor() {
    super();
    this.state = {
      isAuth: true,
      user: null,
      authenticating: true
    }
  }

  async componentDidMount() {
    const res = (await get('get-sess-info/user'));
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
        <Head user={user} authenticating={authenticating}  />
        <Divider />
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={2}>
              <Menu />
            </Grid.Column>
            <Grid.Column width={12}>
              <Body />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Footer />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Client;
