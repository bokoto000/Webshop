import React, { Component } from "react";
import { Grid, Form, Radio, Button, Label, Container } from "semantic-ui-react";
import queryString from "query-string";
const get = require("../../../helpers/fetch").get;

export default class Profits extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let values = queryString.parse(this.props.location.search);
    const res = await get(
      `/enquery/profits/${values.start_date}/${values.end_date}`
    );
    const data = await res.json();
    let startDate = new Date();
    startDate.setTime(data.startDate);
    let endDate = new Date();
    endDate.setTime(data.endDate);
    if (data) {
      this.setState({
        profit: data.total,
        startDate: startDate.toString(),
        endDate: endDate.toString()
      });
    }
    console.log(data);
  }

  render() {
    const products = this.state.products;
    console.log(products);
    return (
      <div>
        Showing Profits from {this.state.startDate} to {this.state.endDate}
        <Container>
          <div className="cart-item-price">
            Печалби:{parseFloat(this.state.profit).toFixed(2)}
            лв
          </div>
        </Container>
      </div>
    );
  }
}
