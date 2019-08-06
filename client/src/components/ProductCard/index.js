import React from "react";
import {
  Grid,
  Form,
  Image,
  Segment,
  Divider,
  Header,
  Button,
  Card
} from "semantic-ui-react";
import "./index.css";

const get = require("../../helpers/fetch").get;

export default class ProductCard extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {

  }

  render() {
    const product = this.props.product;
    console.log(product);
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
          <Button positive>Купи</Button>
        </Card.Content>
      </Card>
    );
  }
}
