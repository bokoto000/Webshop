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

export default class AddPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }

  async componentDidMount() {
    const res = await get(`/permissions/get-permissions`);
    if (res.ok) {
      const permissions = await res.json();
      let options = [];
      for (let i = 0; i < permissions.length; i++) {
        const permission = permissions[i];
        options.push({
          key: permission.id,
          text: permission.name,
          value: permission.id
        });
      }
      this.setState({ options });
    }
    const rolesRes = await get(`/roles/get-roles`);
    if (res.ok) {
      const roles = await rolesRes.json();
      let options = [];
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        options.push({ key: role.id, text: role.role, value: role.id });
      }
      this.setState({ rolesOptions: options });
      this.setState({ roles });
    }
  }

  onSubmit = async () => {
    const res = await post("/role/grant-permission", {
      name: this.state.name,
      permission: this.state.permission
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
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    console.log(this.state.roleId);
    return (
      <div>
        <Container style={{ padding: "1em 0em" }}>
          <Segment>
            <Form onSubmit={this.onSubmit}>
            <Dropdown
                search
                selection
                name="roleId"
                placeholder="Права"
                value={this.state.value}
                onChange={this.handleChange}
                options={this.state.rolesOptions}
              ></Dropdown>
              <Dropdown
                search
                selection
                name="permissionId"
                placeholder="Права"
                value={this.state.value}
                onChange={this.handleChange}
                options={this.state.options}
              ></Dropdown>

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
