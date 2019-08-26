import React, { Component } from "react";
import { Header, Table } from "semantic-ui-react";

export default class Menu extends Component {
  render() {
    return (
      <div>
        <Table color="blue" inverted selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Продукти</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row onClick={()=>console.log("test")}>
              <Table.Cell>Лаптопи</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Телефони</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }
}
