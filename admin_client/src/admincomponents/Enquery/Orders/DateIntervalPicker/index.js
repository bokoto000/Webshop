import React, { Component } from "react";
import { Form } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import queryString from "query-string";

export default class DateIntervalPicker extends Component {
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

  handleChangeStart = date => {
    try {
      const startDate = date;
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      this.setSearchParams("startDate", date.getTime());
      this.setState({
        startDate
      });
    } catch (e) {
      alert("Моля изберете валидна дата");
    }
  };

  handleChangeEnd = date => {
    try {
      const endDate = date;
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      console.log(date.getTime());
      this.setSearchParams("endDate", date.getTime());
      this.setState({
        endDate
      });
    } catch (e) {
      console.error(e);
      alert("Моля изберете валидна дата");
    }
  };

  render() {
    const values = queryString.parse(this.props.location.search);
    let startDate, endDate;
    if (values.startDate) {
      startDate = new Date();
      startDate.setTime(parseInt(values.startDate));
    }
    if (values.endDate) {
      endDate = new Date();
      endDate.setTime(parseInt(values.endDate));
    }
    return (
      <div tyle={{ display: "inline-block" }}>
        <Form>
          <Form.Group inline>
            <Form.Field
              label="от"
              control={DatePicker}
              placeholder="Начална дата"
              selected={startDate ? startDate : null}
              onChange={this.handleChangeStart}
            ></Form.Field>
            <Form.Field
              label="до"
              control={DatePicker}
              placeholder="Крайна дата"
              selected={endDate ? endDate : null}
              onChange={this.handleChangeEnd}
            ></Form.Field>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
