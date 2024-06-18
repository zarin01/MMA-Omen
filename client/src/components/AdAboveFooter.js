import React, { useState, useEffect } from 'react';
import AdSidebarPost from './AdSidebarPost';

export default function AdFooterComponent() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setPosts(posts);
            });
        });
    }, []);

    return (
        <div className="ad-inner-page-footer">
            <div className="ad-footer-content">
                <h2>LATEST MMA NEWS</h2>
                {posts.slice(0, 10).map(post => (
                    <AdSidebarPost key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
}