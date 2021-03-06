import React, { Component } from "react";
import {
  Form,
  Segment,
  Button,
  Container,
  Divider
} from "semantic-ui-react";
import { post } from "../../helpers/fetch";


export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }


  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async () => {
    const res = await post("/resetpassword/forget-password", {
      email: this.state.email
    });
    if (res.ok) {
      this.setState({success:true});
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
          <div>
            <Container>
              За да смените вашата парола, напишете вашият имейл и натиснете
              изпрати. На вашият имейл ще получите инструкции за смяна на
              паролата.
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
          {this.state.error&&!this.state.success ? (
            <div>
              {" "}
              <Container style={{ color: "red" }}>
                Имаше проблем със изпращането на имейл. Моля проверете данните
                си и опитайте пак.
              </Container>
            </div>
          ) : null}
          {this.state.success ? (
            <div>
              {" "}
              <Container style={{ color: "green" }}>
                Успешно изпратен мейл за смяна на парола!
              </Container>
            </div>
          ) : null}
        </Segment>
      </div>
    );
  }
}
