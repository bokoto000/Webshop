import React, { Component } from "react";
import {
  Form,
  Input,
  Segment,
  Button,
  Container,
  Divider,
  Label
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { post, get } from "../../helpers/fetch";

class RestorePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const token = await this.props.match.params.token;
    const res = await get(`/resetpassword/restore-password/${token}`);
    if (res.ok) {
      this.setState({ isOk: true });
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async () => {
    console.log("Clicked");
    if (this.state.password != this.state.verifyPassword) {
      this.setState({ passwordNotVerified: true });
      return;
    }
    const token = await this.props.match.params.token;
    const res = await post(`/resetpassword/change-password`, {
      password: this.state.password,
      verifyPassword: this.state.verifyPassword,
      token
    });
    if (res.ok) {
      alert("Успешно сменихте вашата парола");
      this.props.history.push(`/`);
      window.location.reload();
    } else {
      this.setState({ error: true });
    }
  };

  render() {
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
          {this.state.isOk ? (
            <div>
              <Container></Container>
              <Divider />
              <Form onSubmit={this.onSubmit}>
                <Form.Input
                  fluid
                  label="Парола"
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={this.onChange}
                />
                <Form.Input
                  fluid
                  label="Повтори парола"
                  placeholder="Password"
                  type="password"
                  name="verifyPassword"
                  onChange={this.onChange}
                />
                <Form.Field fluid control={Button}>
                  Смени парола
                </Form.Field>
              </Form>
            </div>
          ) : (
            <Container>Линка ви е изтекъл</Container>
          )}
          {this.state.error ? (
            <Label color="red" basic>
              Имаше проблем със смяната на паролата
            </Label>
          ) : null}
          {this.state.passwordNotVerified ? (
            <Label color="red" basic>
              Имате грешка при повтарянето на паролата
            </Label>
          ) : null}
        </Segment>
      </div>
    );
  }
}


export default withRouter(RestorePassword);