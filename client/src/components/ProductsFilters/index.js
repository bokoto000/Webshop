import React, { Component } from "react";
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

import { withRouter } from "react-router-dom";
import queryString from "query-string";

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
class ProductsFilters extends Component {
  constructor(props) {
    super(props);

  }

  handleSortChange = async (e, { name, value }) => {
    await this.setState({ [name]: value });
    let values = queryString.parse(this.props.location.search);
    values[name] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
    window.location.reload();
  };

  handleChange = async (e, { name, value }) => {
    await this.setState({ loading: true });
    let values = queryString.parse(this.props.location.search);
    values[name] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
    await this.setState({ loading: false });
  };
  filterProducts = () => {  
    let values = queryString.parse(this.props.location.search);
    values["page"] = 0; 
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
    window.location.reload();
  }
  render() {
    const values = queryString.parse(this.props.location.search);
    return (
      <div>
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
      </div>
    );
  }
}

export default withRouter(ProductsFilters);
