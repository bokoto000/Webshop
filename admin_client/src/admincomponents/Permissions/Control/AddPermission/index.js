import React, { Component } from "react";
import {
  Form,
  Container,
  Segment,
  Button,
  Label,
  Dropdown,
  Table,
  Checkbox
} from "semantic-ui-react";

const post = require("./../../../../helpers/fetch").post;

const get = require("./../../../../helpers/fetch").get;

export default class AddPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      rolesOptions: []
    };
  }

  //Setting roles and permissions data
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
      this.setState({ permissions, originalPermissions: permissions });
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

  //Submit form which grants permissions
  onSubmit = async () => {
    const res = await post("/roles/grant-permission", {
      roleId: this.state.roleId,
      perms: this.state.permissions
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

  handleRoleChange = async (e, { value }) => {
    const res = await get(`/roles/get-role-permissions/${value}`);
    this.setState({ roleId: value });
    if (res.ok) {
      const rolePermissions = await res.json();
      let originalPermissions = this.state.originalPermissions;
      const originalPermissionsLength = originalPermissions.length;
      const rolePermissionsLength = rolePermissions.length;
      console.log(originalPermissions);
      console.log(rolePermissions);
      for (let i = 0; i < originalPermissionsLength; i++) {
        originalPermissions[i].isTicked = false;
        for (let j = 0; j < rolePermissionsLength; j++) {
          if (originalPermissions[i].id == rolePermissions[j].permission_id) {
            originalPermissions[i].isTicked = true;
          }
        }
      }
      this.setState({ permissions: originalPermissions });
    } else {
      alert("Неуспешно добавени права!");
    }
  };

  ToggleCheckbox = (id) => {
    let permissions = this.state.permissions;
    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i].id == id) {
        permissions[i].isTicked = !permissions[i].isTicked;
      }
    }
    this.setState({ permissions });
  }

  render() {
    return (
      <div>
        <Container style={{ padding: "1em 0em" }}>
          <Segment>
            <Form onSubmit={this.onSubmit}>
              <Dropdown
                search
                options={this.state.rolesOptions}
                selection
                name="roleId"
                placeholder="Роля"
                value={this.state.value}
                onChange={this.handleRoleChange}
              ></Dropdown>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Име</Table.HeaderCell>
                    <Table.HeaderCell>Дадено право</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.permissions
                    ? this.state.permissions.map(permission => {
                      return (
                        <Table.Row key={permission.id}>
                          <Table.Cell>{permission.name}</Table.Cell>
                          <Table.Cell>
                            <Checkbox onChange={() => this.ToggleCheckbox(permission.id)} checked={permission.isTicked}></Checkbox>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                    : null}
                </Table.Body>
              </Table>

              <Form.Field>
                <Button fluid type="submit">
                  Дай право
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
