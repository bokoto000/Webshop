import React, { Component } from "react";
import { Header, Table, Button, Modal } from "semantic-ui-react";
import Register from "./../../Register";

import { withRouter } from "react-router-dom";
import { get } from "./../../../helpers/fetch";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const res = await get(`/admin/get-admins-with-roles`);
    if (res.ok) {
      const admins = await res.json();
      console.log(admins);
      this.setState({ admins });
    } else {
      console.log("Error");
    }
  }

  handleEdit = id => {
    this.props.history.push(`/admin/edit-user/${id}`);
  };

  render() {
    const admins = this.state.admins;

    return (
      <div>
        <Modal trigger={<Button>Register</Button>}>
          <Modal.Header>Register</Modal.Header>
          <Modal.Content>
            <Register></Register>
          </Modal.Content>
        </Modal>
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
