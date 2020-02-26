import React from "react";
import {
  Button,
  Card,
  Loader
} from "semantic-ui-react";
import {
  NotificationManager
} from "react-notifications";
import "./index.css";

const post = require("../../helpers/fetch").post;
const get = require("../../helpers/fetch").get;

export default class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addedProduct: false
    };
  }

  async componentDidMount() {
    this.setState({loading:true});
    const productId = this.props.product.id;
    const res = (await (await get(`/images/get-product-image/${productId}`)).json());
    console.log(productId+ " ok");
    this.setState({image_data:res.image_data});
    this.setState({loading:false});
  }

  async buyItem() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart !== "[]") {
      let done = false;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === this.props.product.id) {
          cart[i].count++;
          done = true;
        }
      }
      if (done === false) {
        cart.push({
          id: this.props.product.id,
          name: this.props.product.name,
          image: this.props.product.image,
          description: this.props.product.description,
          price: this.props.product.price,
          count: 1
        });
      }
    } else {
      cart = [];
      cart.push({ id: this.props.product.id, count: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    const res = await post("/cart/buy-item", {
      id: this.props.product.id
    });
    if (res.ok) {
      NotificationManager.success("Добавен Продукт","", 3000, () => {
      });
    }
    else{
      NotificationManager.error("Проблем при добавянето на продукт ","", 3000, () => {
      });
    }
  }

  render() {
    const product = this.props.product;
    return (
      <Card>
        {this.state.loading?
        <Loader active>

        </Loader>
        :<div className="product-image">
          <img  src={`data:image/jpeg;base64,${this.state.image_data}`} alt="Loading" className="product-image" />
        </div>
      }
        <Card.Content>
          <Card.Header>{product.name}</Card.Header>
          <Card.Meta>
            <span className="price">{product.price} лв</span>
          </Card.Meta>
          <Card.Description>{product.description}</Card.Description>
        </Card.Content>
        <Button positive onClick={() => this.buyItem()}>
          Купи
        </Button>
      </Card>
    );
  }
}
