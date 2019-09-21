import React, { Component } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import queryString from "query-string";
import DatePicker from "react-datepicker";
import { Grid, Form, Radio, Button, Label } from "semantic-ui-react";
import Products from "./Products";
import Profits from "./Profits";
import "react-datepicker/dist/react-datepicker.css";

class Enquiry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date()
    };
  }

  handleChangeStart = date => {
    this.setState({
      startDate: date
    });
  };
  handleChangeEnd = date => {
    console.log(date.getTime());
    this.setState({
      endDate: date
    });
  };

  handleTypeChange = (e, { value }) => this.setState({ type: value });

  onSubmit = async () => {
    const startDate = new Date(this.state.startDate.getTime());
    const endDate = new Date(this.state.endDate.getTime());
    const start_date = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const end_date = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      23,
      59,
      59
    );
    const type = this.state.type;
    if (startDate > endDate) {
      alert("Началната дата е след крайната");
      return;
    }
    let values = queryString.parse(this.props.location.search);
    values["start_date"] = start_date.getTime();
    values["end_date"] = end_date.getTime();
    this.props.history.push({
      pathname: `/enquery/${type}`,
      search: "?" + new URLSearchParams(values).toString()
    });
    window.location.reload();
  };

  render() {
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
                <Label basic>Изберете тип:</Label>
                <Form.Field>
                  <Radio
                    label="Приходи"
                    name="radioGroup"
                    value="profits"
                    checked={this.state.type === "profits"}
                    onChange={this.handleTypeChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    label="Продукти"
                    name="radioGroup"
                    value="products"
                    checked={this.state.type === "products"}
                    onChange={this.handleTypeChange}
                  />
                </Form.Field>
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
      </div>
    );
  }
}

export default withRouter(Enquiry);
