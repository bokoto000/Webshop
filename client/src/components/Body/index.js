import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import ProductDisplay from "../ProductDisplay";
import Menu from "../Menu";

export default class Body extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column width={2}>
              <Menu />
            </Grid.Column>
            <Grid.Column width={12}>
              <ProductDisplay />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
