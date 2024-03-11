import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup(props) {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = 'mongodb+srv://sheryarkhan927:sherry@sherrynotebook.fxlfri9.mongodb.net/?retryWrites=true&w=majority&appName=SherryNoteBook/api/auth/createuser';
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
            });
            const json = await response.json();
            if (json.success) {
                localStorage.setItem('token', json.token);
                props.showAlert('Signed up successfully!');
                navigate('/');
            } else {
                props.showAlert('Invalid credentials');
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    return (
        <div className='container mt-5'>
            <h1 className="text-center mb-4">Join Us!</h1>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} placeholder="Enter your name" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" placeholder="Enter your email" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Enter your password" />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default Signup;
