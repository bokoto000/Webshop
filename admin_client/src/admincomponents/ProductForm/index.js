import React from "react";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Form,
  Image,
  Segment,
  Divider,
  Header,
  Button
} from "semantic-ui-react";
import FileBase64 from "react-file-base64";

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
        stock: 0,
        selectedFile: null
      };
    }

    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };

    getFiles(files) {
      console.log(files);
      this.setState({ files: files });
    }

    onSubmit = async () => {
      const res = await post("/product/create", {
        image: this.state.files[0].base64,
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        stock: this.state.stock
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Имаше проблем със създаването на продукта!");
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
                      <FileBase64
                        multiple={true}
                        onDone={this.getFiles.bind(this)}
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
