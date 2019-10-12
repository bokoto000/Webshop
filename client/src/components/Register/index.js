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
import Recaptcha from "react-recaptcha";
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

  recaptchaLoaded() {
  }

  verifyCallback(response) {
    try {
      if (response) {
        this.setState({
          isVerified: true
        });
      }
    } catch (e) {
      
    }
  }

  onSubmit = async () => {
    console.log(this.state.isVerified);
    if (this.state.hasAcceptedTerms) {
      if (this.state.isVerified) {
        const res = await post("/user/register", {
          username: this.state.username,
          password: this.state.password,
          email: this.state.email,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        });
        console.log(res);
        if (res.ok) {
          window.location.reload();
        } else {
          const resJson = await res.json();
          console.log(resJson);
          this.setState({ error: resJson.error });
        }
      } else {
        alert("Please verify that you are a human!");
      }
    } else {
      alert("Please accept the terms");
    }
  };
  toggle = () => this.setState((prevState) => ({ hasAcceptedTerms: !prevState.hasAcceptedTerms }))

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
              <Form.Field required>
                <Checkbox
                  checked={this.state.hasAcceptedTerms}
                  onChange={this.toggle}
                  label={
                    <label>
                      Съгласявам се с{" "}
                      <Popup
                        content="Доста дълги условия за ползване"
                        trigger={
                          <a >
                            Условията за ползване
                          </a>
                        }
                      />
                    </label>
                  }
                />
              </Form.Field>
              <Recaptcha
                sitekey="6LfGb7QUAAAAACEjJLDnxl31GWzjTdE0401rme_e"
                render="explicit"
                onloadCallback={this.recaptchaLoaded}
                verifyCallback={this.verifyCallback}
              />
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
