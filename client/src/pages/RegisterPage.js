import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

// auth.js
export async function login(username, password, setUserInfo, setRedirect, setErrorMessage) {
    const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
    } else {
        const result = await response.json();
        setErrorMessage(result.message || 'Wrong Credentials');
    }
}

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [admin, setAdmin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function register(ev) {
        ev.preventDefault();

        // Validate username
        const usernameValidation = validateUsername(username);
        if (usernameValidation !== true) {
            setErrorMessage(usernameValidation);
            return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (passwordValidation !== true) {
            setErrorMessage(passwordValidation);
            return;
        }

        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, admin }),
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (response.status === 200) {
            // Registration successful, now log the user in
            setAdmin(false);
            await login(username, password, setUserInfo, setRedirect, setErrorMessage);
        } else if (response.status === 409) {
            setErrorMessage('Username already taken');
        } else {
            setErrorMessage(result.message || 'Registration failed');
        }
    }

    function validateUsername(username) {
        if (!username) {
            return 'Username cannot be empty';
        }
        return true;
    }

    function validatePassword(password) {
        const minLength = 8;
        if (!password) {
            return 'Password cannot be empty';
        }
        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long`;
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one digit';
        }
        return true;
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Register</button>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
    );
}