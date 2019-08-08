import React from "react";
import { withRouter, } from "react-router-dom";
import {
  Grid,
  Form,
  Image,
  Segment,
  Divider,
  Header,
  Button
} from "semantic-ui-react";
import "./index.css";

const post = require("../../helpers/fetch").post;

export default withRouter(
  class ProductForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        image: "",
        name: "",
        description: "",
        price: 0,
        stock: 0
      };
    }

    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = async () => {
      const res = await post("/product/create", {
        image: this.state.image,
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        stock: this.state.stock
      });
      if (res.ok) {
        window.location.reload();
      }
    };

    render() {
      return (
        <div style={{ minWidth: "400px" }}>
          <Grid verticalAlign="middle" columns={4} centered>
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment textAlign="center" className="login-form">
                  <Header>Регистрирай продукт</Header>
                  <Divider />
                  <Segment basic textAlign="left">
                    <Form onSubmit={this.onSubmit}>
                      <Form.Input
                        fluid
                        label="Image"
                        placeholder="Image"
                        name="image"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Name"
                        placeholder="Name"
                        name="name"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Description"
                        placeholder="Description"
                        name="description"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Price"
                        placeholder="Price"
                        name="price"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Stock"
                        placeholder="Stock"
                        name="stock"
                        onChange={this.onChange}
                      />
                      <Form.Field fluid control={Button}>
                        Save
                      </Form.Field>
                    </Form>
                  </Segment>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
  }
);
