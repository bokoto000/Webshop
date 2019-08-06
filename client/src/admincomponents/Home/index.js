import React from "react";

import { Grid } from "semantic-ui-react";
import Menu from "../Menu";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";
import ProductForm from "../ProductForm";
import ProductDisplay from "../ProductDisplay";
import "./index.css";
const post = require("../../helpers/fetch").post;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      activeItem: null
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  async handleLogOut() {
    const res = await post("/admin/logout");
    if (res.ok) {
      window.location.reload();
    }
  }

  render() {
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Head />
          </Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={1}>
              <Menu />
            </Grid.Column>
            <Grid.Column width={8}>
              <ProductDisplay />
            </Grid.Column>
            <Grid.Column witdh={2}>
              <ProductForm />
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
