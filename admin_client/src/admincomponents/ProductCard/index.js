import React from "react";
import {
  Grid,
  Form,
  Image,
  Segment,
  Modal,
  Header,
  Button,
  Card
} from "semantic-ui-react";
import "./index.css";
import EditProduct from "../EditProduct";

const post = require("../../helpers/fetch").post;

export default class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockEdit: 0,
      stock: 0,
      modalOpen: false
    };
  }

  async componentDidMount() {
    this.setState({ stockEdit: this.props.product.stock });
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  async onSubmit() {
    const res = await post("/product/update-stock", {
      stock: this.state.stock,
      id: this.props.product.id
    });
    if (res.ok) {
      this.setState({ stockEdit: this.state.stock });
      this.handleClose();
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const product = this.props.product;
    console.log(this.state.modalOpen);
    return (
      <Card>
        <div className="product-image">
          <img src={product.image} className="product-image" />
        </div>
        <Card.Content>
          <Card.Header>{product.name}</Card.Header>
          <Card.Meta>
            <span className="price">{product.price} лв</span>
          </Card.Meta>
          <Card.Description>{product.description}</Card.Description>
        </Card.Content>
        <Header>
          <div style={{ alignContent: "center" }}>
            <span>Наличност:</span>
            <span className="stock-edit-number">{this.state.stockEdit}</span>
            <Modal
              trigger={
                <Button
                  onClick={this.handleOpen}
                  className="stock-edit-button"
                  size="tiny"
                >
                  ✐
                </Button>
              }
              open={this.state.modalOpen}
              onClose={this.handleClose}
            >
              <Modal.Content>
                <Form.Input
                  fluid
                  label="Наличност"
                  placeholder={product.stock}
                  name="stock"
                  onChange={this.onChange}
                />
                <Button onClick={async () => await this.onSubmit()}>
                  Save
                </Button>
              </Modal.Content>
            </Modal>
          </div>
        </Header>
        <EditProduct product={product} />
      </Card>
    );
  }
}
