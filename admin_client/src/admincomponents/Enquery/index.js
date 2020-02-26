import React, { Component } from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import queryString from "query-string";
import DatePicker from "react-datepicker";
import { Grid, Form, Radio, Button, Label } from "semantic-ui-react";
import Products from "./Products";
import Orders from "./Orders";
import "react-datepicker/dist/react-datepicker.css";

class Enquery extends Component {
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
      search: "?" + new URLSearchParams(values).toString()
    });
    window.location.reload();
  };

  render() {
    return (
      <div>
        <Switch >
          <Route
            exact
            path={`${this.props.match.url}/products`}
            component={Products}
          />
          <Route
            exact
            path={`${this.props.match.url}/orders`}
            component={Orders}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(Enquery);
