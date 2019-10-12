import React, { Component } from "react";
import { Header, Table, Button, Modal, Dropdown, Label } from "semantic-ui-react";
import queryString from "query-string";
import Register from "./../../Register";

import { withRouter } from "react-router-dom";
import { get } from "./../../../helpers/fetch";
import { isFriday } from "date-fns";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const resRoles = await get(`/roles/get-roles`);
    if (resRoles.ok) {
      const roles = await resRoles.json();
      let options = [];
      options.push({ key: undefined, text: "All", value: undefined });
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        options.push({ key: role.id, text: role.role, value: role.id });
      }
      this.setState({ rolesOptions: options });
    } else {
      alert("Could not load roles");
    }
    const res = await get(`/admin/get-admins-with-roles`);
    if (res.ok) {
      const admins = await res.json();
      this.setState({ admins });
    } else {
      alert("Could not load admins");
    }
  }


  handleEdit = id => {
    this.props.history.push(`/admin/edit-user/${id}`);
  };


  handleChange = (e, { value }) => {
    let values = queryString.parse(this.props.location.search);
    values["user_type"] = value;
    this.props.history.push({
      search: "?" + new URLSearchParams(values).toString()
    });
  };

  filterUsers = () => {
    const admins = this.state.admins;
    if (admins) {
      let filteredAdmins = [];
      let values = queryString.parse(this.props.location.search);
      if (values["user_type"] != "undefined") {
        const filterRole = values["user_type"];
        for (let i = 0; i < admins.length; i++) {
          if (admins[i].role_id == filterRole) {
            filteredAdmins.push(admins[i]);
          }
        }
      } else filteredAdmins = admins;
      return filteredAdmins;
    } else {
      return [];
    }
  }


  render() {
    const admins = this.filterUsers();

    return (
      <div>
        <Modal trigger={<Button>Register</Button>}>
          <Modal.Header>Register</Modal.Header>
          <Modal.Content>
            <Register></Register>
          </Modal.Content>
        </Modal>
        <Dropdown
          search
          selection
          name="roleId"
          placeholder="Вид потребители"
          value={this.state.value}
          onChange={this.handleChange}
          options={this.state.rolesOptions}
        ></Dropdown>
        <Header>Потребители:</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Потребителско име</Table.HeaderCell>
              <Table.HeaderCell>Име</Table.HeaderCell>
              <Table.HeaderCell>Фамилия</Table.HeaderCell>
              <Table.HeaderCell>Мейл</Table.HeaderCell>
              <Table.HeaderCell>Роля</Table.HeaderCell>
              <Table.HeaderCell>Действие</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {admins
              ? admins.map(admin => {
                return (
                  <Table.Row>
                    <Table.Cell>{admin.username}</Table.Cell>
                    <Table.Cell>{admin.firstName}</Table.Cell>
                    <Table.Cell>{admin.lastName}</Table.Cell>
                    <Table.Cell>{admin.email}</Table.Cell>
                    <Table.Cell>{admin.role}</Table.Cell>
                    <Table.Cell>
                      <Button onClick={() => this.handleEdit(admin.id)}>
                        Edit
                        </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
              : null}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default withRouter(Users);
