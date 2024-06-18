import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

export default function ReplyComment({ parentId, refreshComments, onReplySubmit, postId }) {
    const [body, setBody] = useState('');
    const { userInfo } = useContext(UserContext);

    async function createNewComment(ev) {
        ev.preventDefault();
        if (!userInfo) {
            alert('Must be logged in to create a comment');
            return;
        }

        const data = new FormData();
        data.set('body', body);
        data.set('username', userInfo.username);
        data.set('userId', userInfo._id);
        data.set('parentId', parentId);
        data.set('postId', postId);

        try {
            const response = await fetch('http://localhost:4000/comment', {
                method: 'POST',
                body: data,
                credentials: 'include',
            });

            if (response.ok) {
                setBody(''); // Clear the textarea after successful submission
                refreshComments(); // Refresh the comments list
                onReplySubmit(); // Hide the reply form
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

    return (
        <form className="reply-comment-form" onSubmit={createNewComment}>
            <textarea
                placeholder="Write your reply..."
                value={body}
                onChange={ev => setBody(ev.target.value)}
            />
            <button style={{ marginTop: '15px' }}>Post Reply</button>
        </form>
    );
}