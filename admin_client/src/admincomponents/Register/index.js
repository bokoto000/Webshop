import React from "react";
import {
  Container,
  Checkbox,
  Popup,
  Form,
  Segment,
  Button,
  Label
} from "semantic-ui-react";
import "./index.css";

const post = require("../../helpers/fetch").post;

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.verifyCallback = this.verifyCallback.bind(this);

    this.state = {
      username: "",
      password: "",
      isVerified: false,
      hasAcceptedTerms: false,
      error: null
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async () => {
    const res = await post("/admin/register", {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    });
    if (res.ok) {
      window.location.reload();
    } else {
      if (res) {
        const resJson = await res.json();
        this.setState({ error: resJson.error });
      }
    }
  };
  toggle = () =>
    this.setState(prevState => ({
      hasAcceptedTerms: !prevState.hasAcceptedTerms
    }));

  render() {
    return (
      <div>
        <Container style={{ padding: "1em 0em" }}>
          <Segment>
            <Form onSubmit={this.onSubmit}>
              <Form.Field>
                <label> Потребителско име</label>
                <input
                  placeholder="Потребителско име"
                  required
                  name="username"
                  onChange={this.onChange}
                />
              </Form.Field>
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

              <Form.Field>
                <Button fluid type="submit">
                  Регистрирай се!
                </Button>
              </Form.Field>
              {this.state.error ? (
                <Label color="red">{this.state.error}</Label>
              ) : null}
            </Form>
          </Segment>
        </Container>
      </div>
    );
  }
}
