import React, { Component } from "react";
import queryString from "query-string";
import { Form, Dropdown } from "semantic-ui-react";

let hourDropdown = [];
for (let i = 0; i <= 24; i++) {
  hourDropdown.push({ id: i, value: i, text: i + ":00" });
}

export default class HourIntervalPicker extends Component {
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

  handleHourChange = (e, { name, value }) => {
    this.setSearchParams(name, value);
  };

  render() {
    const values = queryString.parse(this.props.location.search);
    const startHour = parseInt(values.startHour);
    const endHour = parseInt(values.endHour);
    console.log(startHour);
    return (
      <div style={{display:"inline-block"}}>
        <Form>
          <Form.Group inline>
            Между:
            <Dropdown
              search
              selection
              name="startHour"
              placeholder="Начален час"
              value={
                startHour >= 0
                  ? parseInt(startHour)
                  : null
              }
              onChange={this.handleHourChange}
              options={hourDropdown}
            ></Dropdown>
            <Dropdown
              search
              selection
              name="endHour"
              placeholder="Краен час"
              value={
                endHour >= 0
                  ? endHour
                  : null
              }
              onChange={this.handleHourChange}
              options={hourDropdown}
            ></Dropdown>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
