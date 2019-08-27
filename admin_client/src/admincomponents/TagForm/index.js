import React from "react";
import { withRouter } from "react-router-dom";
import {
  Grid,
  Form,
  Label,
  Segment,
  Divider,
  Header,
  Button
} from "semantic-ui-react";
import "./index.css";

const post = require("../../helpers/fetch").post;

export default withRouter(
  class TagForm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        name: ""
      };
    }

    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    };

    onSubmit = async () => {
      const res = await post("/tag/create", {
        name: this.state.name
      });
      if (res.ok) {
        window.location.reload();
      }
    };

    render() {
      return (
        <div style={{ minWidth: "400px" }}>
          <Grid verticalAlign="middle" centered>
            <Grid.Row>
              <Grid.Column>
                <Segment textAlign="center">
                  <Header>Регистрирай tag</Header>
                  <Divider />
                  <Segment basic textAlign="left">
                    <Form onSubmit={this.onSubmit}>
                      <Form.Input
                        fluid
                        label="Tag"
                        placeholder="tag"
                        name="name"
                        onChange={this.onChange}
                      />
                      <Form.Field fluid control={Button}>
                        Save
                      </Form.Field>
                    </Form>
                    <Divider/>
                    {this.props.tags
                      ? this.props.tags.map(tag => {
                          return (
                            <Label key={tag.id} as="a" tag>
                              {tag.name}
                            </Label>
                          );
                        })
                      : null}
                  </Segment>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }
  }
);
