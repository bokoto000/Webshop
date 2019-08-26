import React, { Component } from "react";
import {
  Container,
  Checkbox,
  Popup,
  Form,
  Segment,
  Button
} from "semantic-ui-react";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Container>
          <Segment>
            <Container>Потребителско име:</Container>
            <Container>Email:</Container>
            <Container>Име:</Container>
            <Container>Фамилия:</Container>
          </Segment>
        </Container>
        <Container style={{ padding: "1em 0em" }}>
          <Segment>
            <Form onSubmit={this.onSubmit}>
              <Form.Field>
                <label> Собствено име</label>
                <input
                  placeholder="Собствено име"
                  required
                  name="firstName"
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field>
                <label> Фамилия</label>
                <input
                  placeholder="Фамилия"
                  required
                  name="lastName"
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field>
                <label> E-mail </label>
                <input
                  type="email"
                  placeholder="E-mail"
                  required
                  name="email"
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field>
                <label> Парола </label>
                <input
                  type="password"
                  placeholder="Парола"
                  required
                  name="password"
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field required />
              <Form.Field>
                <Button fluid type="submit">
                  Промени
                </Button>
              </Form.Field>
            </Form>
          </Segment>
        </Container>
      </div>
    );
  }
}
