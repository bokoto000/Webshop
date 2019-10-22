import React, { Component } from "react";
import queryString from "query-string";
import { Form, Dropdown } from "semantic-ui-react";

const groupOptions = [
  { key: 1, text: "None", value: "None" },
  { key: 2, text: "Status", value: "Status" }
];

export default class GroupByPicker extends Component {
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
    const values = queryString.parse(this.props.location.search);
    const groupBy = values.groupBy;
    return (
      <div>
        <Form>
          <Form.Group inline>
            Group By:
            <Dropdown
              search
              selection
              name="groupBy"
              placeholder="None"
              value={groupBy?groupBy:null}
              onChange={this.handleChange}
              options={groupOptions}
            ></Dropdown>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
