import { useEffect, useState } from "react";
import Post from "../../post.js";
import AdSidebarComponent from "../../components/AdSidebar.js";

export default function MuayThaiPage() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        fetch('http://localhost:4000/post')
            .then(response => response.json())
            .then(posts => {
                const filteredPosts = posts.filter(post => 
                    post.sports && post.sports.toLowerCase().includes('muay thai')
                );
                setPosts(filteredPosts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }, []);
    
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="internal-page-content">
            <div className="index-middle-posts">
                <h2 className="page-heading">RECENT MMA NEWS</h2>
                {currentPosts.map((post, index) => (
                    <Post key={post._id} {...post} index={index} />
                ))}
            </div>
            <br />
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <AdSidebarComponent />
        </div>
    );
}
