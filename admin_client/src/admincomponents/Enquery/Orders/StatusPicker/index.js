import React, { Component } from "react";
import queryString from "query-string";
import { Dropdown } from "semantic-ui-react";

const options = [
  { key: 1, text: "All", value: "All" },
  { key: 2, text: "Sent", value: "Sent" },
  { key: 3, text: "Verified", value: "Verified" },
  { key: 4, text: "Canceled", value: "Canceled" },
  { key: 5, text: "Paid", value: "Paid" }
];

export default class StatusPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setSearchParams(name, value) {
    let values = queryString.parse(this.props.location.search);
    values[name] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
  }

  handleChange = (e, { name, value }) => {
    this.setSearchParams(name, value);
    //this.getOrders(value);
  };

  render() {
    return (
      <div>
        <label style={{ marginBottom: "auto", marginTop: "auto" }}>
          Status:
        </label>
        <Dropdown
          selection
          name="status"
          options={options}
          placeholder="All"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
