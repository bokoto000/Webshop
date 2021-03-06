import React, { Component } from "react";
import {
  Container,
  Table,
  Form,
  Segment,
  Button
} from "semantic-ui-react";

const get = require("../../helpers/fetch").get;
const post = require("../../helpers/fetch").post;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      newPassword: "",
      newPasswordVerify: "",
    };
  }

  async componentDidMount() {
    const res = await get("get-sess-info/user");
    if (res.ok) {
      const user = (await res.json()).user;
      console.log(user);
      this.setState({ isAuth: true, user: user, authenticating: false });
      this.setState({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    } else {
      this.setState({ isAuth: false, authenticating: false });
    }
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async () => {
    const res = await post("/user/update-user-data", {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    });
    if (res.ok) {
      window.location.reload();
    } else {
      this.setState({ error: true });
    }
  };

  passwordChange = async () => {
    const res = await post('/user/change-password',{
      password:this.state.password,
      newPassword:this.state.newPassword,
      newPasswordVerify:this.state.newPasswordVerify
    });
    if(res.ok){
      window.location.reload();
    } else {
      alert("Error changing password");
    }

  };

  render() {
    const user = this.state.user;
    return (
      <div>
        {this.state.isAuth ? (
          <div>
            <Container>
              <Segment>
                {user ? (
                  <Table>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Потребителско име:</Table.Cell>
                        <Table.Cell>
                          {user.username ? user.username : ""}
                        </Table.Cell>
                      </Table.Row>{" "}
                      <Table.Row>
                        <Table.Cell>Email:</Table.Cell>
                        <Table.Cell>{user.email ? user.email : ""}</Table.Cell>
                      </Table.Row>{" "}
                      <Table.Row>
                        <Table.Cell>Име:</Table.Cell>
                        <Table.Cell>
                          {user.firstName ? user.firstName : ""}
                        </Table.Cell>
                      </Table.Row>{" "}
                      <Table.Row>
                        <Table.Cell>Фамилия:</Table.Cell>
                        <Table.Cell>
                          {user.lastName ? user.lastName : ""}
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                ) : null}
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
                      value={this.state.firstName}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label> Фамилия</label>
                    <input
                      placeholder="Фамилия"
                      required
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.onChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label> E-mail </label>
                    <input
                      type="email"
                      required
                      name="email"
                      onChange={this.onChange}
                      value={this.state.email}
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
            <Container style={{ padding: "1em 0em" }}>
              <Segment>
                <Form onSubmit={this.passwordChange}>
                  <Form.Field>
                    <label>Парола:</label>
                    <input
                      placeholder="Парола"
                      type="password"
                      required
                      name="password"
                      onChange={this.onChange}
                      value={this.state.password}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label> Нова парола:</label>
                    <input
                      placeholder="Нова парола"
                      type="password"
                      required
                      name="newPassword"
                      value={this.state.newPassword}
                      onChange={this.onChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label> Повтори нова парола: </label>
                    <input
                      placeholder="Нова парола"
                      type="password"
                      required
                      name="newPasswordVerify"
                      value={this.state.newPasswordVerify}
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
        ) : null}
      </div>
    );
  }
}
