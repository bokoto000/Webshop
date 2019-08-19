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

  async componentDidMount() {}

  async buyItem() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart!="[]") {
      let done = false;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == this.props.product.id) {
          cart[i].count++;
          done = true;
        }
      }
      if(done==false){
        cart.push({"id":this.props.product.id,"name":this.props.product.name,"image":this.props.product.image,
        "description":this.props.product.description, "price":this.props.product.price,
         "count":1})
      }
    }
    else {
      cart = [];
      cart.push({"id":this.props.product.id, "count":1})
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  render() {
    const product = this.props.product;
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
        <Button positive onClick={()=>this.buyItem()}>
          Купи
        </Button>
      </Card>
    );
  }
}
