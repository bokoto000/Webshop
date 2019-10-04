import React, { Component } from "react";
import {
  Form,
  Container,
  Segment,
  Button,
  Label,
  Dropdown
} from "semantic-ui-react";

const post = require("./../../../../helpers/fetch").post;

const get = require("./../../../../helpers/fetch").get;

export default class CreatePermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }

  onSubmit = async () => {
    const res = await post("/permissions/create-permission", {
        name: this.state.name,
        permission: this.state.permission,
    });
    if (res.ok) {
        window.location.reload();
    } else {
        if (res) {
            const resJson = await res.json();
            this.setState({ error: resJson.error });
        }
        window.location.reload();
    }
};

onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
};

  render() {
    console.log(this.state.roleId);
    return (
      <div>
        <Container style={{ padding: "1em 0em" }}>
          <Segment>
            <Form onSubmit={this.onSubmit}>
            <Form.Field>
                <label> Име на право</label>
                <input
                  placeholder="Име"
                  required
                  name="name"
                  onChange={this.onChange}
                />
              </Form.Field>
              <Form.Field>
                <label> Право</label>
                <input
                  placeholder="Право"
                  required
                  name="permission"
                  onChange={this.onChange}
                />
              </Form.Field>

              <Form.Field>
                <Button fluid type="submit">
                  Направи право
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
