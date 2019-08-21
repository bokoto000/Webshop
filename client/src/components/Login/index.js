import React from 'react';
import { Grid, Form, Image, Segment, Divider, Header, Button } from 'semantic-ui-react';
import './index.css'
import Register from "../Register";

const post = require('../../helpers/fetch').post;


export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        };
    }


    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    onSubmit = async () => {
        const res = await post('/user/login', {
            username: this.state.username,
            password: this.state.password
        })
        if (res.ok) {
            window.location.reload();
        }
    }

    render() {
        return (
            <div style={{minWidth:"300px" }}>
                <Grid verticalAlign='middle' columns={4} centered>
                    <Grid.Row>
                        <Grid.Column className="login-col">
                            <Segment textAlign='center' className='login-form' style={{minWidth:"300px!important" }}>
                                <Segment basic textAlign='left'>
                                    <Form onSubmit={this.onSubmit}>
                                        <Form.Input fluid label='Потребителско име' placeholder='Потребителско име' name='username' onChange={this.onChange} />
                                        <Form.Input fluid type='password' label='Парола' placeholder='Парола' name='password' onChange={this.onChange} />
                                        <Form.Field fluid control={Button}>Влез</Form.Field>
                                    </Form>
                                </Segment>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}