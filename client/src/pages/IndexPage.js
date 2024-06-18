import { useEffect, useState } from "react";
import Post from "../post.js";
import AdSidebarComponent from "../components/AdSidebar.js";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        fetch('http://localhost:4000/post')
            .then(response => response.json())
            .then(posts => setPosts(posts))
            .catch(error => console.error('Error fetching posts:', error));
    }, []);

    // Calculate indices for pagination
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    // Latest 7 posts
    const latestPosts = posts.slice(0, 11);

    // Filter UFC posts
    const filteredUFCPosts = posts.filter(post => 
        Array.isArray(post.organizations) && 
        post.organizations.some(orgArray => 
            Array.isArray(orgArray) && 
            orgArray.some(org => typeof org === 'string' && org.toLowerCase() === 'ufc')
        )
    );
   // console.log(filteredUFCPosts);

    // Limit UFC posts to the first 8
    const ufcPosts = filteredUFCPosts.slice(0, 8);

    // Paginated older posts (posts after the latest 7)
    const olderPosts = posts.slice(12);
    const paginatedPosts = olderPosts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(olderPosts.length / postsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="index-page-content">
            <div className="index-post-columns">
                <div className="index-page-posts">
                    {latestPosts.map((post, index) => (
                        <Post key={post.id} {...post} index={index} />
                    ))}
                </div>
                <br /><h2 className="page-heading">RECENT UFC NEWS</h2><br />
                <div className="index-middle-posts">
                    
                    {ufcPosts.map((post, index) => (
                        <Post key={post.id} {...post} index={index} />
                    ))}
                </div>
                <br /><h2 className="page-heading">Older Posts</h2>
                <div className="index-last-posts">
                    
                    {paginatedPosts.map((post, index) => (
                        <Post key={post.id} {...post} index={index} />
                    ))}
                    
                </div>
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
            </div>
            
            <AdSidebarComponent />
        </div>
    );
}
