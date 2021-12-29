import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [user, setUser] = useState({email: "", password: ""})

    const onChangeHandler = (e) =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const loginSubmit = async(e) =>{
        e.preventDefault()
        try {
            await axios.post('/user/login', {...user})

            localStorage.setItem('firstLogin', true)
            
            window.location.href = "/";
        } catch (error) {
            alert(error.response.data.msg)
        }
    }
    const showPassword = () =>{
        let p = document.getElementById('inputPassword')
        p.type === 'password' ? p.type = 'text' : p.type = 'password'
    }

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={loginSubmit}>
                <input type="email" name="email" required 
                placeholder="Email" value={user.email}
                onChange={onChangeHandler} autoComplete="off"/>

                <span>
                    <input type="password" name="password" required 
                placeholder="Password" value={user.password}
                onChange={onChangeHandler} autoComplete="off" id='inputPassword'/>
                <i className="far fa-eye" id="check" onClick={showPassword} ></i>
                </span>

                <div className="row">
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login
