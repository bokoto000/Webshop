import React from 'react';
import './index.css'
const post = require('../../helpers/fetch').post;

//Компонент за начална страница

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            activeItem: null
        };
    }


    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    async handleLogOut() {
        const res = await post('/admin/logout')
        if(res.ok) {
            window.location.reload();
        }
    }

    render() {
        return (
            <div >
               <h1>Admin Home</h1>
            </div>
        )
    }
}