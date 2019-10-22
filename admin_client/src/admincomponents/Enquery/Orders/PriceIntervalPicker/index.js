import React, { Component } from "react";
import queryString from "query-string";
import { Form, Input, Segment } from "semantic-ui-react";

export default class PriceIntervalPicker extends Component {
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

  handleChangePrice = async (e, { name, value }) => {
    this.setSearchParams(name, value);
    this.setState({ [name]: value });
  };


  render() {
    const values = queryString.parse(this.props.location.search);
    const higherprice = values.higherprice;
    const lowerprice = values.lowerprice;
    return (
      <div>
        <Form>
          <Segment.Inline>
            <Form.Field inline>
              Цена:
              <Input
                className="price-box"
                placeholder={values.lowerprice >= 0 ? values.lowerprice : "от"}
                name="lowerprice"
                type="number"
                min={0}
                onChange={this.handleChangePrice}
                value={lowerprice?lowerprice:""}
              />
              <Input
                className="price-box"
                placeholder={values.higherprice >= 0 ? values.higherprice : "до"}
                name="higherprice"
                type="number"
                min={0}
                onChange={this.handleChangePrice}
                value={higherprice?higherprice:""}
              />
            </Form.Field>
          </Segment.Inline>
        </Form>
      </div>
    );
  }
}
