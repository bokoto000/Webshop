import React from "react";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Form,
  Modal,
  Segment,
  Divider,
  Header,
  Button
} from "semantic-ui-react";
import "./index.css";

const post = require("../../helpers/fetch").post;

export default withRouter(
  class EditProduct extends React.Component {
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
      const res = await post("/product/update-product", {
        image: this.state.image,
        name: this.state.name,
        description: this.state.description,
        price: this.state.price,
        id: this.props.product.id
      });
      if (res.ok) {
        window.location.reload();
      }
    };

    componentDidMount() {
      const product = this.props.product;
      this.setState({
        image: product.image,
        name: product.name,
        description: product.description,
        price: product.price
      });
    }

    render() {
      return (
        <Modal
          trigger ={
            <Button>Edit</Button>
          }>
          <div style={{ minWidth: "400px" }}>
            <Grid verticalAlign="middle" columns={4} centered>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Segment textAlign="center" className="login-form">
                    <Header>Промени продукт</Header>
                    <Divider />
                    <Segment basic textAlign="left">
                      <Form.Input
                        fluid
                        label="Image"
                        value={this.state.image}
                        name="image"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Name"
                        value={this.state.name}
                        name="name"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Description"
                        value={this.state.description}
                        name="description"
                        onChange={this.onChange}
                      />
                      <Form.Input
                        fluid
                        label="Price"
                        value={this.state.price}
                        name="price"
                        onChange={this.onChange}
                      />
                      <Button onClick={this.onSubmit}>Update</Button>
                    </Segment>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Modal>
      );
    }
  }
);
