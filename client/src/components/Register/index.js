import React from "react";
import {
  Container,
  Checkbox,
  Popup,
  Form,
  Segment,
  Button
} from "semantic-ui-react";
import "./index.css";

const post = require("../../helpers/fetch").post;

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async () => {
    const res = await post("/user/register", {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      firstName: this.state.firstName,
      lastName:this.state.lastName

    });
    if (res.ok) {
      window.location.reload();
    }
  };

  render() {
    return (
      <div>
        <Container style={{ padding: "1em 0em" }}>
          <Segment>
            <Form onSubmit={this.onSubmit}>
              <Form.Field hidden name="_csrf" value={this.state.csrf} />
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
                  label={
                    <label>
                      Съгласявам се с{" "}
                      <Popup
                        content="Доста дълги условия за ползване"
                        trigger={
                          <a onClick={this.onClickAgree}>
                            Условията за ползване
                          </a>
                        }
                      />
                    </label>
                  }
                />
              </Form.Field>
              <Form.Field>
                <Button fluid type="submit">
                  Регистрирай се!
                </Button>
              </Form.Field>
            </Form>
          </Segment>
        </Container>
      </div>
    );
  }
}
