import React, { Component } from "react";
import {
  Header,
  Button,
  Segment,
  Container,
  Table,
  Modal,
  Icon
} from "semantic-ui-react";
import { addMinutes } from "date-fns/esm";

const get = require("../../helpers/fetch").get;
const post = require("../../helpers/fetch").post;

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      modalOpen: false
    };
  }

  handleOpen = (roleId, role) => {
    this.setState({ modalOpen: true, roleId, role });
  };
  handleClose = () => this.setState({ modalOpen: false });

  handleRemoveRole = async ()=>{
    const user = this.state.user;
    const roleId = this.state.roleId;
    const res = await post(`/roles/cancel-role/`,{
          userId:user.id,
          roleId
      });
    if(res.ok){
        window.location.reload();
    } else{
        alert("Error removing role from user");
    }
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    const res = await get(`/admin/get-admin/${id}`);
    if (res.ok) {
      const user = await res.json();
      console.log(user);
      this.setState({ user });
    }
  }

  render() {
    const user = this.state.user;
    console.log(this.state.modalOpen);
    return (
      <div>
        <Header>
          Промяна на потребител: {user.firstName} {user.lastName}
        </Header>
        <Segment>
          <Container>Потребителско име: {user.username}</Container>
          <Container>Мейл: {user.email}</Container>
          {/*<Container>
            //Възстановяване на парола: <Button size="tiny">възстанови</Button>
          //</Container>*/}
          <Container>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Роля</Table.HeaderCell>{" "}
                  <Table.HeaderCell>Действие</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {user.roles
                  ? user.roles.map(role => {
                      return (
                        <Table.Row>
                          <Table.Cell>{role.role}</Table.Cell>
                          <Table.Cell>
                            <Button
                              onClick={() =>
                                this.handleOpen(role.role_id, role.role)
                              }
                            >Премахни</Button>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })
                  : null}
              </Table.Body>
            </Table>
          </Container>
        </Segment>
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          size="small"
        >
          <Header>
            <Button onClick={this.handleClose}>
              <Icon name="close"></Icon>
            </Button>
          </Header>
          <Modal.Content>
            <h3>ID на роля:{this.state.roleId}</h3>
            <h3>Име на роля:{this.state.role}</h3>
            <Button onClick={this.handleRemoveRole}>
                    Премахни роля
            </Button>
          </Modal.Content>
          <Modal.Actions></Modal.Actions>
        </Modal>
      </div>
    );
  }
}
