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
    const products = this.props.products;

    this.setState({ filtering: true });
    this.setState({ unfilteredProducts: products });
    this.setState({ products: products });
    this.setState({ filtering: false });
  }

  filterProducts = () => {
    let products = this.state.unfilteredProducts;
    const values = queryString.parse(this.props.location.search);
    let sort = values.sort ? values.sort : "newest";
    const pageCount = products.length / this.state.perPage;
    products = this.pageFilterProducts(products);
    return { products, pageCount };
  };

  componentWillReceiveProps(newProps) {
    const products = newProps.products;
    const pageCount = products.length / this.state.perPage;
    this.setState({
      products: newProps.products,
      unfilteredProducts: newProps.products,
      pageCount
    });
  }

  pageFilterProducts(originalProducts) {
    let products = [];
    if (originalProducts) {
      const page = this.state.page;
      const perPage = this.state.perPage;
      for (let i = page * perPage; i < (page + 1) * perPage; i++) {
        if (originalProducts[i]) products.push(originalProducts[i]);
      }
    }

    return products;
  }

  handlePageClick = data => {
    let selected = data.selected;
    this.setState({ page: selected });
  };

  render() {
    const data = this.filterProducts();
    const products = data.products;
    const pageCount = data.pageCount;
    const loading = this.state.loading;
    const values = queryString.parse(this.props.location.search);
    return (
      <div style={{ width: "100%" }}>
          {products && !loading ? (
          <Card.Group itemsPerRow={5}>
            {products.map(product => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </Card.Group>
        ) : null}
        {loading ? <Loader></Loader> : null}
      </div>
    );
  }
}

export default withRouter(ProductDisplay);
