import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import _ from "lodash";
import { Search, Header, Label } from "semantic-ui-react";

const get = require("../../helpers/fetch").get;

const initialState = { isLoading: false, results: [], value: "" };
const resultRenderer = ({ name,price,id }) => (
  <div key={id}>
    <Header  >{name}</Header>
    <Label basic color="green"> {price} лв</Label>
  </div>
);
resultRenderer.propTypes = {
  name: PropTypes.string,
  price: PropTypes.string,
  id: PropTypes.number
}



class SearchBar extends Component {
  state = initialState;
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let products = (await (await get("/product/get-products")).json()).products;
    this.setState({ products });
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.name });
    this.props.history.push(`/product/${result.id}`)
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.name);
      this.setState({
        isLoading: false,
        results: _.filter(this.state.products, isMatch).slice(0, 9)
      });
    }, 300);
  };

  reload = () => {
    const current = this.props.location.pathname;
    this.props.history.replace(`/reload`);
    setTimeout(() => {
      this.props.history.replace(current);
    });
  };

  render() {
    return (
      <div>
        <Search
          loading={this.state.isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true
          })}
          results={this.state.results}
          resultRenderer={resultRenderer}
          value={this.state.value}
        />
      </div>
    );
  }
}

export default withRouter(SearchBar);
