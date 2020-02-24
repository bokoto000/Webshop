import React from "react";
import {
  Dropdown,
  Loader,
  Card,
  Icon,
  Grid,
  Button,
  Input,
  Segment,
  Form,
  Header
} from "semantic-ui-react";
import { Redirect, withRouter } from "react-router-dom";
import queryString from "query-string";
import ProductCard from "../ProductCard";
import "./index.css";
import filters from "../../helpers/filters";

const filterOptions = [
  {
    key: 0,
    text: `Най-нови`,
    value: "newest"
  },
  {
    key: 1,
    text: "Най-евтини",
    value: "cheapest"
  },
  {
    key: 2,
    text: "Най-скъпи",
    value: "priciest"
  },
  {
    key: 3,
    text: "Най-стари",
    value: "oldest"
  }
];

class ProductDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unfilteredProducts: [],
      products: [],
      filtering: true,
      lowerprice: null,
      higherprice: null,
      perPage: 25,
      pageCount: 25,
      page: 0,
      sort: "newest"
    };
  }

  async componentDidMount() {
    this.setState({loading:true});
    const products = this.props.products;
    this.setState({ products: products });
    this.setState({loading:false});
  }

  async componentWillReceiveProps(newProps) {
    await this.setState({loading:true});
    await this.setState({
      products: newProps.products
    });
    this.setState({loading:false});
  }

  render() {
    const products = this.state.products;
    const loading = this.state.loading;
    console.log(loading);
    if(loading){
      return <Loader active> </Loader>;
    }
    return (
      <div style={{ width: "100%" }}>
          {products && !loading ? (
          <Card.Group itemsPerRow={5}>
            {products.map(product => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </Card.Group>
        ) : null}
      </div>
    );
  } 
}

export default withRouter(ProductDisplay);
