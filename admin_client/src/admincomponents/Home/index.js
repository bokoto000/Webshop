import React from "react";

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
        <Head />
        <Grid style={{ minHeight: "80vh" }}>
          <Grid.Row >
            <Grid.Column >
              <Menu />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}
