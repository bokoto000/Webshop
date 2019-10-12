import React, { Component } from "react";
import { Form, Container, Segment, Button, Label, Dropdown } from 'semantic-ui-react';

const post = require("./../../../helpers/fetch").post;

const get = require("./../../../helpers/fetch").get;

export default class AssignRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options:[]
        };
    }

    async componentDidMount() {
        const rolesRes = await get(`/roles/get-roles`);
        if (rolesRes.ok) {
            const roles = await rolesRes.json();
            let options = [];
            for (let i = 0; i < roles.length; i++) {
                const role = roles[i];
                options.push({ key: role.id, text: role.role, value: role.id })
            }
            this.setState({ rolesOptions: options });
            this.setState({ roles });
        }
    }

    onSubmit = async () => {
        const user = this.props.user;
        console.log(user);
        const userId = this.props.user.id;
        const res = await post("/roles/assign-role", {
            roleId: this.state.roleId,
            userId
        });
        if (res.ok) {
            window.location.reload();
        } else {
            if (res) {
                const resJson = await res.json();
                this.setState({ error: resJson.error });
            }
        }
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChange = (e, { name, value }) => this.setState({ [name]: value })


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
                                placeholder="Роля"
                                value={this.state.value}
                                onChange={this.handleChange}
                                options={this.state.rolesOptions}
                            ></Dropdown>

                            <Form.Field>
                                <Button fluid type="submit">
                                    Дай роля
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
