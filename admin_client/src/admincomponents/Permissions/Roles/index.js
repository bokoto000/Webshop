import React, { Component } from "react";
import { Form, Container, Segment, Button, Label } from 'semantic-ui-react';
import DeleteRole from "./DeleteRole";

const post = require("../../../helpers/fetch").post;

export default class Roles extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit = async () => {
        const res = await post("/roles/create-role", {
            roleName: this.state.name,
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
        return (
            <div>
                <Container style={{ padding: "1em 0em" }}>
                    <Segment>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Field>
                                <label> Име на роля</label>
                                <input
                                    placeholder="Име"
                                    required
                                    name="name"
                                    onChange={this.onChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Button fluid type="submit">
                                    Направи роля
                </Button>
                            </Form.Field>
                            {this.state.error ? (
                                <Label color="red">{this.state.error}</Label>
                            ) : null}
                        </Form>
                    </Segment>
                </Container>
                <DeleteRole></DeleteRole>
            </div>
        );
    }
}
