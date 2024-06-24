import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import CommentsList from "./CommentList";

export default function CreateComment({ parentId }) {
    const [body, setBody] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [upVote, setUpVote] = useState('');
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [useId, setId] = useState('');
    const navigate = useNavigate();
    const {id} = useParams();
    
    useEffect(() => {
        fetch('http://localhost:4000/post/'+id)
          .then(response => {
            response.json().then(postInfo => {
                setId(postInfo.id);
            });
          });
      }, []);

    useEffect(() => {
        async function checkUserStatus() {
            try {
                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }
        checkUserStatus();
    }, [setUserInfo]);
   
    async function createNewComment(ev) {
        ev.preventDefault();
        if (!userInfo || userInfo.message === 'Unauthorized') {
            alert('Must be logged in to create a comment');
            navigate('/login');
            return;
        }

        const data = new FormData();
        data.set('body', body);
        data.set('username', userInfo.username);
        data.set('userId', userInfo._id);
        data.set('upVote', upVote);
        data.set('postId', id);
        if (parentId) {
            data.set('parentId', parentId);
        }

        try {
            const response = await fetch('http://localhost:4000/comment', {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
            if (response.ok) {
                setRedirect(true);
            } else {
                const errorData = await response.json();
                console.error('Error creating comment:', errorData);
                alert('Failed to create comment');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to create comment');
        }
    }
    

    if (redirect) {
        return window.location.reload();
    }
    //console.log(userInfo.message);
   
    return (
        <div>
            <form className="create-comment-form" onSubmit={createNewComment}>
                <textarea
                    placeholder="Write your comment..."
                    value={body}
                    onChange={ev => setBody(ev.target.value)}
                />
                <button style={{ marginTop: '15px' }}>Post Comment</button>
            </form>
            <CommentsList postId={id} />
        </div>
    );
}
