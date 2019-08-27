import React, { Component } from "react";
import {
  Form,
  Input,
  Segment,
  Button,
  Container,
  Divider
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { post } from "../../helpers/fetch";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async () => {
    
  };

  render() {
    console.log(this.props.match.params.token);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <Segment style={{ width: "500px" }}>
          <div>
            <Container>
            </Container>
            <Divider />
            <Form onSubmit={this.onSubmit}>
              <Form.Input
                fluid
                label="Email"
                placeholder="Email"
                type="email"
                name="email"
                onChange={this.onChange}
              />
              <Form.Field fluid control={Button}>
                Изпрати мейл
              </Form.Field>
            </Form>
          </div>
          {this.state.error ? (
            <div>
              {" "}
              <Container style={{ color: "red" }}>
                Имаше проблем със изпращането на имейл. Моля проверете данните
                си и опитайте пак.
              </Container>
            </div>
          ) : null}
        </Segment>
      </div>
    );
  }
}
