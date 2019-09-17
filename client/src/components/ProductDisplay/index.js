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
import ReactPaginate from "react-paginate";
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
    const higherprice = this.state.higherprice,
      lowerprice = this.state.lowerprice;
    if (lowerprice) {
      products = filters.filterBetweenPrice(products, lowerprice, higherprice);
    }
    this.setState({ products });
    this.setState({ filtering: false });
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

  pageFilterProducts() {
    const originalProducts = this.state.products;
    const page = this.state.page;
    const perPage = this.state.perPage;
    const productsLength = originalProducts.length;
    let products = [];
    for (let i = page * perPage; i < (page + 1) * perPage; i++) {
      if (originalProducts[i]) products.push(originalProducts[i]);
    }
    return products;
  }

  handlePageClick = data => {
    let selected = data.selected;
    this.setState({ page: selected });
  };

  render() {
    const products = this.pageFilterProducts();
    return (
      <div key={this.props.products} style={{ width: "100%" }}>
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
              return <ProductCard key={product.id} product={product} />;
            })}
          </Card.Group>
        ) : null}
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pagination-item"}
          activeClassName={"active"}
        />
      </div>
    );
  }
}
