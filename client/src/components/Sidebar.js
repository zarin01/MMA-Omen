import { useEffect, useState } from "react";
import SidebarPost from "./SidebarPost.js";

export default function SidebarComponent() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post')
            .then(response => response.json())
            .then(posts => setPosts(posts));
    }, []);

    return (
        <div className="inner-page-sidebar">
            <div className="inner-sidebar-content">
                <h2>LATEST MMA NEWS</h2>
                {posts.slice(0, 5).map(post => (
                    <SidebarPost key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
}