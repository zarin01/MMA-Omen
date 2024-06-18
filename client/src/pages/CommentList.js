import { useEffect, useState, useContext } from "react";
import ReplyComment from "../components/ReplyComment";
import UpvoteWithUser from "../components/VoteButton";
import { UserContext } from "../UserContext";

export default function CommentsList({ postId }) {
    const [commentInfo, setCommentInfo] = useState([]);
    const [commentPostId, setCommentPostId] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const { setUserInfo, userInfo } = useContext(UserContext); // Get the current user's info

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, [setUserInfo]);

    useEffect(() => {
        fetchComments();
    }, [postId]); // Fetch comments when postId changes

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:4000/comments?postId=${postId}`);
            const data = await response.json();
            setCommentInfo(data);
            const ids = data.map(comment => comment._id); // Extract IDs from comments
            setCommentPostId(ids);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleReplyClick = (commentId) => {
        setReplyingTo(commentId === replyingTo ? null : commentId);
    };

    const handleDeleteClick = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:4000/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                // Directly update the state after deletion
                setCommentInfo(prevComments => prevComments.filter(comment => comment._id !== commentId));
                console.log('Comment deleted successfully');
            } else {
                const errorData = await response.json();
                console.error('Failed to delete comment:', errorData);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleReplySubmit = () => {
        setReplyingTo(null);
        fetchComments();
    };

    const badWords = ["badword1", "badword2", "badword3"]; // Add your bad words here

    const censorBadWords = (text) => {
        const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
        return text.replace(regex, '***');
    };

    const renderComments = (comments, parentId = null) => {
        return comments
            .filter(comment => comment.parentId === parentId && comment.postId === postId) // Filter by postId
            .map(comment => (
                <div key={comment._id}>
                    <div className={`comment ${parentId ? 'reply' : ''}`}>
                        <div className="comment-content">
                            <small>by {comment.username}</small>
                            <p>{censorBadWords(comment.body)}</p>
                            <div className="reply-comment">
                                <span className="reply-button" onClick={() => handleReplyClick(comment._id)}>
                                    {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                                </span>
                                {userInfo && userInfo.username === comment.username && (
                                    <span className="delete-button" onClick={() => handleDeleteClick(comment._id)}>
                                        Delete
                                    </span>
                                )}
                                <div className="up-vote-comment">
                                    <UpvoteWithUser commentId={comment._id} initialCount={comment.upVote} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {replyingTo === comment._id && (
                        <ReplyComment
                            parentId={comment._id}
                            postId={postId}
                            refreshComments={fetchComments}
                            onReplySubmit={handleReplySubmit}
                        />
                    )}
                    <div className="replies">
                        {renderComments(comments, comment._id)}
                    </div>
                </div>
            ));
    };

    return (
        <div className="comments-list">
            {renderComments(commentInfo)}
        </div>
    );
}
