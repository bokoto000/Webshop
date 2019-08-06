import React, { Component } from "react";
import { Grid, Divider } from "semantic-ui-react";
import Menu from "../Menu";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";

class Client extends Component {
  render() {
    return (
      <div style={{ paddingLeft: "30px" }}>
        <Head />
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
