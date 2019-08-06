import React, { Component } from "react";
import {
  Button,
  Container,
  Menu,
  Segment,
  Visibility,
  Modal,
  Popup
} from "semantic-ui-react";
import Login from "../Login";
import Register from "../Register";
import { Link } from "react-router-dom";
import "./index.css";

const fetch = require("../../helpers/fetch");
const get = fetch.get;

class Head extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      authenticating: props.authenticating
    };
  }

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  handleSignOut = async () => {
    await get("/signout");
    window.location.reload();
  };

  render() {
    const fixed = this.state.fixed;
    const authenticating = this.state.authenticating;
    const user = this.state.user;
    if (authenticating) {
      return (
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
          className="dekstop-header"
        >
          <Segment
            inverted
            textAlign="center"
            vertical
            className="dekstopheader"
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
              className="dekstopheader-menu"
              style={{ padding: "0em 0em" }}
            >
              <Container>
                <Menu.Item as={Link} to="/" style={{ padding: "0em 0em" }}>
                  {/*logo*/}
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
        </Visibility>
      );
    } else {
      if (user) {
        return (
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
            className="dekstop-header"
          >
            <Segment
              inverted
              textAlign="center"
              vertical
              className="dekstopheader"
            >
              <Menu
                fixed={fixed ? "top" : null}
                inverted={!fixed}
                pointing={!fixed}
                secondary={!fixed}
                size="large"
                className="dekstopheader-menu"
                style={{ padding: "0em 0em" }}
              >
                <Container>
                  <Menu.Item as={Link} to="/" style={{ padding: "0em 0em" }}>
                    {/*logo*/}
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button
                      as={Link}
                      to="/timeline"
                      inverted={!fixed}
                      primary={fixed}
                      style={{ marginLeft: "0.5em" }}
                      className="dekstopheader-button"
                      color="blue"
                    >
                      Дневник
                    </Button>
                    <Button
                      as={Link}
                      to="/profile"
                      inverted={!fixed}
                      primary={fixed}
                      style={{ marginLeft: "0.5em" }}
                      className="dekstopheader-button"
                      color="blue"
                    >
                      Профил
                    </Button>
                    <Button
                      onClick={this.handleSignOut}
                      inverted={!fixed}
                      primary={fixed}
                      style={{ marginLeft: "0.5em" }}
                      className="dekstopheader-button"
                      color="blue"
                    >
                      Изход
                    </Button>
                  </Menu.Item>
                </Container>
              </Menu>
            </Segment>
          </Visibility>
        );
      } else {
        return (
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
            className="dekstop-header"
          >
            <Segment
              inverted
              textAlign="center"
              vertical
              className="dekstopheader"
            >
              <Menu
                fixed={fixed ? "top" : null}
                inverted={!fixed}
                pointing={!fixed}
                secondary={!fixed}
                size="large"
                className="dekstopheader-menu"
                style={{ padding: "0em 0em" }}
              >
                <Container>
                  <Menu.Item as={Link} to="/" style={{ padding: "0em 0em" }}>
                    {/*logo*/}
                  </Menu.Item>
                  <Menu.Item position="right" style={{ padding: "1em 0em" }}>
                    <Popup
                      trigger={
                        <Button
                          inverted={!fixed}
                          className="dekstopheader-button"
                          color="blue"
                        >
                          Вход
                        </Button>
                      }
                      content={<Login />}
                      basic
                      on="click"
                    />
                    <Modal
                      style={{ width: "500px" }}
                      trigger={
                        <Button
                          as={Link}
                          inverted={!fixed}
                          primary={fixed}
                          style={{ marginLeft: "0.5em" }}
                          className="dekstopheader-button"
                          color="blue"
                        >
                          Регистрация
                        </Button>
                      }
                    >
                      <Modal.Content>
                        <Register />
                      </Modal.Content>
                    </Modal>
                  </Menu.Item>
                </Container>
              </Menu>
            </Segment>
          </Visibility>
        );
      }
    }
  }
}

export default Head;
