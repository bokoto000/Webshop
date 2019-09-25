import React, { Component } from "react";
import { Grid, Form, Radio, Button, Label, Table } from "semantic-ui-react";
import queryString from "query-string";
const get = require("../../../helpers/fetch").get;

export default class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let values = queryString.parse(this.props.location.search);
    const res = await get(
      `/enquery/products/${values.start_date}/${values.end_date}`
    );
    const data = await res.json();
    console.log(Date(data.startDate) + " " + Date(data.endDate));
    let startDate = new Date();
    startDate.setTime(data.startDate);
    let endDate = new Date();
    endDate.setTime(data.endDate);
    if (data) {
      this.setState({
        products: data.productsArr,
        startDate: startDate.toString(),
        endDate: endDate.toString()
      });
    }
    console.log(data);
  }

  render() {
    const products = this.state.products;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Form onSubmit={this.onSubmit}>
              <Form.Group inline>
                <Form.Field
                  label="от"
                  control={DatePicker}
                  selected={this.state.startDate}
                  onChange={this.handleChangeStart}
                ></Form.Field>

                <Form.Field
                  label="до"
                  control={DatePicker}
                  selected={this.state.endDate}
                  onChange={this.handleChangeEnd}
                ></Form.Field>
              </Form.Group>

              <Form.Group inline>
                <Form.Field fluid control={Button}>
                  Направи справка
                </Form.Field>
              </Form.Group>
            </Form>
          </Grid.Row>
          <Grid.Row>
            <Switch style={{ minHeight: "80vh" }}>
              <Route
                exact
                path={`${this.props.match.url}/products`}
                component={Products}
              />
              <Route
                exact
                path={`${this.props.match.url}/profits`}
                component={Profits}
              />
            </Switch>
          </Grid.Row>
        </Grid>
        Showing from {this.state.startDate} to {this.state.endDate}
        <Table>
          <Table.Header>
            <Table.HeaderCell>Име</Table.HeaderCell>
            <Table.HeaderCell>Код</Table.HeaderCell>
            <Table.HeaderCell>Наличност</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {products && products.length > 0
              ? products.map(product => {
                  return (
                    <Table.Row>
                      <Table.Cell>{product.name}</Table.Cell>
                      <Table.Cell>{product.id}</Table.Cell>
                      <Table.Cell>-{product.stock}</Table.Cell>
                    </Table.Row>
                  );
                })
              : null}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
