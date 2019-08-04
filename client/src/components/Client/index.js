import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import Menu from "../Menu";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";

class Client extends Component {
  render() {
    return (
    <div>
        <Grid>
          <Grid.Row>
            <Head />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Menu />
            </Grid.Column>
            <Grid.Column>
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
