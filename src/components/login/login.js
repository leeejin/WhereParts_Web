import React, { Component } from 'react';
import { Form } from "react-bootstrap";
import { Navigate } from 'react-router-dom';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputID: '',
            inputPW: '',
            loginSuccess: false,
        }
    }
    componentDidMount() {
        console.log('com', this.props.toString)
    }
    loginButtonClicked = () => {
        console.log('login')
        this.setState({ loginSuccess: true })
    }

    onInputIDHandler = (value) => {
        console.log(value)
        this.setState({ inputID: value })
    }
    onInputPWHandler = (value) => {
        this.setState({ inputPW: value })
    }


    render() {
        return (
            //디자인
            <div className="d-flex login-component w-100">
                <form>
                    <div className="background" >
                        <label>ID</label>
                        <Form.Control
                            type='text' value={this.state.inputID} onChange={(e) => { this.onInputIDHandler(e.target.value) }}
                        />
                    </div>
                    <div className="background" >
                        <label>Password</label>
                        <Form.Control
                            type='password' value={this.state.inputPW} onChange={(e) => { this.onInputPWHandler(e.target.value) }}
                        />
                    </div>
                    <div className="background" >
                        <button className="loginbutton w-100 darknavy" onClick={this.loginButtonClicked}>Login</button>
                    </div>
                    {this.state.loginSuccess && (<Navigate to='DashBoard' />)}
                </form>
            </div>
        )
    }

}