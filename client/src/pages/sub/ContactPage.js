import React, { useEffect, useState, useContext } from "react";

import AdSidebarComponent from "../../components/AdSidebar.js";
import { UserContext } from "../../UserContext.js";

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const { userInfo } = useContext(UserContext); 
    
    useEffect(() => {
        if (userInfo) {
            setName(userInfo.username);
        }
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        if (honeypot) {
            // If the honeypot field is filled out, treat it as spam
            console.log("Spam detected!");
            return;
        }

        // Create form data to send to the backend
        const formData = {
            name,
            email,
            message
        };

        try {
            const response = await fetch('http://localhost:4000/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Thank you for your message. We will get back to you soon.');
                setName('');
                setEmail('');
                setMessage('');
                setHoneypot('');
            } else {
                alert('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="contact-page-content">
            <div className="contact-form-container">
                <h1>Contact Us</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    {/* Honeypot field, hidden from users */}
                    <div className="form-group honeypot">
                        <label htmlFor="honeypot">Leave this field empty:</label>
                        <input
                            type="text"
                            id="honeypot"
                            value={honeypot}
                            onChange={e => setHoneypot(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <AdSidebarComponent />
        </div>
    );
}
