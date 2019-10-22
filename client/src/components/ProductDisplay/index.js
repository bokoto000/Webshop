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

  handleChange = async (e, { name, value }) => {
    await this.setState({ loading: true });
    let values = queryString.parse(this.props.location.search);
    values[name] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
    this.filterProducts();
    await this.setState({ loading: false });
  };

  handleSortChange = async (e, { name, value }) => {
    await this.setState({ [name]: value });
    let values = queryString.parse(this.props.location.search);
    values[name] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
    this.filterProducts();
  };

  filterProducts = () => {
    let products = this.state.unfilteredProducts;
    const values = queryString.parse(this.props.location.search);
    let sort = values.sort ? values.sort : "newest";
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
    const higherprice = values.higherprice,
      lowerprice = values.lowerprice;
    if (lowerprice) {
      products = filters.filterBetweenPrice(products, lowerprice, higherprice);
    }
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
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Dropdown
                selection
                name="sort"
                options={filterOptions}
                placeholder="Най-нови"
                onChange={this.handleSortChange}
                value={values.sort ? values.sort : "newest"}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Form>
                <Segment.Inline>
                  <Form.Field>
                    <Input
                      className="price-box"
                      placeholder={
                        values.lowerprice ? values.lowerprice : "от цена"
                      }
                      name="lowerprice"
                      type="number"
                      onChange={this.handleChange}
                      value={values.lowerprice ? values.lowerprice : 0}
                    />
                    -
                    <Input
                      className="price-box"
                      placeholder={
                        values.higherprice ? values.higherprice : "до цена"
                      }
                      name="higherprice"
                      type="number"
                      onChange={this.handleChange}
                      value={values.higherprice ? values.higherprice : 0}
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
        {products && !loading ? (
          <Card.Group itemsPerRow={5}>
            {products.map(product => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </Card.Group>
        ) : null}
        {loading ? <Loader></Loader> : null}
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
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

export default withRouter(ProductDisplay);
