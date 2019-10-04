import React from "react";
import { Route, Switch, withRouter, BrowserRouter } from "react-router-dom";
import {
  Grid,
  Table,
  Button,
  Menu as SemanticMenu,
  Dropdown
} from "semantic-ui-react";
import Head from "../Head";
import Body from "../Body";
import Footer from "../Footer";
import ProductForm from "../ProductForm";
import ProductDisplay from "../ProductDisplay";
import TagForm from "../TagForm";
import "./index.css";
import PendingOrders from "../PendingOrders";

const post = require("../../helpers/fetch").post;
const get = require("../../helpers/fetch").get;

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      path: "",
      activeItem: "account"
    };
  }

  async componentDidMount() {
    const tags = (await (await get("/tag/get-tags")).json()).tags;
    this.setState({ tags });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  async handleLogOut() {
    const res = await post("/admin/logout");
    if (res.ok) {
      window.location.reload();
    }
  }

  redirect = path => {
    this.props.history.push(`${path}`);
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.redirect(name);
  };

  render() {
    const activeItem = this.state.activeItem;
    return (
      <div>
        <SemanticMenu vertical>
          <SemanticMenu.Item
            name="/"
            active={activeItem === "/"}
            onClick={this.handleItemClick}
          >
            Продукти
          </SemanticMenu.Item>
          <SemanticMenu.Item
            name="/create-product"
            active={activeItem === "/create-product"}
            onClick={this.handleItemClick}
          >
            Добави продукт
          </SemanticMenu.Item>
          <SemanticMenu.Item
            name="/create-tag"
            active={activeItem === "/create-tag"}
            onClick={this.handleItemClick}
          >
            Тагове
          </SemanticMenu.Item>
          <SemanticMenu.Item
            name="/orders"
            active={activeItem === "/orders"}
            onClick={this.handleItemClick}
          >
            Поръчки
          </SemanticMenu.Item>
          <SemanticMenu.Item
            name="enquery"
            active={activeItem === "enquery"}
            onClick={this.handleItemClick}
          >
            Справки
          </SemanticMenu.Item>
          <SemanticMenu.Item>
            Справки
            <SemanticMenu.Menu>
              <SemanticMenu.Item
                name="/enquery/products"
                active={activeItem === "/enquery/products"}
                onClick={this.handleItemClick}
              >
                Продукти
              </SemanticMenu.Item>
              <SemanticMenu.Item
                name="/enquery/orders"
                active={activeItem === "/enquery/orders"}
                onClick={this.handleItemClick}
              >
                Поръчки
              </SemanticMenu.Item>
            </SemanticMenu.Menu>
          </SemanticMenu.Item>
          <SemanticMenu.Item>
            Права и роли
            <SemanticMenu.Menu>
              <SemanticMenu.Item
                name="/permissions/control"
                active={activeItem ==="/permissions/control"}
                onClick={this.handleItemClick}
              >
                Контрол на права
              </SemanticMenu.Item>
              <SemanticMenu.Item
                name="/permissions/create-user"
                active={activeItem === "/permissions/create-user"}
                onClick={this.handleItemClick}
              >
                Създаване на потребител
              </SemanticMenu.Item>
              <SemanticMenu.Item
                name="/permissions/roles"
                active={activeItem ==="/permissions/roles"}
                onClick={this.handleItemClick}
              >
                Създаване на роли
              </SemanticMenu.Item>
            </SemanticMenu.Menu>
          </SemanticMenu.Item>
        </SemanticMenu>
      </div>
    );
  }
}

export default withRouter(Menu);
