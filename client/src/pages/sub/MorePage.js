import { useEffect, useState } from "react";
import Post from "../../post.js";
import AdSidebarComponent from "../../components/AdSidebar.js";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post')
            .then(response => response.json())
            .then(posts => setPosts(posts))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);


    return (
        <div className="index-page-content">
            <div className="index-post-columns">
                <div className="index-page-posts">
                    {posts.map((post, index) => (
                        <Post key={post.id} {...post} index={index} />
                    ))}
                </div>
            </div>
            
            <AdSidebarComponent />
        </div>
    );
}
