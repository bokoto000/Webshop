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
  Form
} from "semantic-ui-react";
import { Redirect } from "react-router-dom";
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

export default class ProductDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unfilteredProducts: [],
      products: [],
      filtering: true,
      lowerprice: null,
      higherprice: null,
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

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSortChange = async (e, { name, value }) => {
    await this.setState({ [name]: value });
    this.filterProducts();
  };


  filterProducts = () => {
    this.setState({ filtering: true });
    let products = this.state.unfilteredProducts;
    console.log(products);
    const sort = this.state.sort;
    if (sort == "newest") {
      products = filters.filterNewest(products);
    }
    if (sort == "oldest") {
      products = filters.filterOldest(products);
    }
    if (sort == "cheapest") {
      products = filters.filterLowestPrice(products);
    }
    if (sort == "priciest") {
      products = filters.filterHighestPrice(products);
    }
    console.log(products);
    const higherprice = this.state.higherprice,
      lowerprice = this.state.lowerprice;
    if (higherprice && lowerprice) {
      products = filters.filterBetweenPrice(products, lowerprice, higherprice);
    }
    this.setState({ products });
    this.setState({ filtering: false });
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      products: newProps.products,
      unfilteredProducts: newProps.products
    });
  }
  render() {
    const products = this.state.products;
    console.log(products);
    console.log(this.state.sort);
    return (
      <div key={this.props.products} style={{ height: "80vh", width: "100%" }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Dropdown
                selection
                name="sort"
                options={filterOptions}
                placeholder="Най-нови"
                onChange={this.handleSortChange}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Form>
                <Segment.Inline>
                  <Form.Field>
                    <Input
                      className="price-box"
                      placeholder="цена"
                      name="lowerprice"
                      type="number"
                      onChange={this.handleChange}
                    />
                    -
                    <Input
                      className="price-box"
                      placeholder="цена"
                      name="higherprice"
                      type="number"
                      onChange={this.handleChange}
                    />
                    <Button type="submit" onClick={this.filterProducts}>
                      <Icon name="search" />
                    </Button>
                  </Form.Field>
                </Segment.Inline>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.products && this.state.filtering ? (
          <Loader />
        ) : products ? (
          <Card.Group itemsPerRow={5}>
            {products.map(product => {
              return <ProductCard product={product} />;
            })}
          </Card.Group>
        ) : null}
      </div>
    );
  }
}
