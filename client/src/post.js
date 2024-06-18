import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, content, cover, createdAt, summary, title, author, alt, index }) {
    // Use optional chaining to safely access author.username and set a default value
    const authorName = author?.username || 'No Name';

    return (
        <div className={`post post-size-${index}`}>
            <div className='image'>
                <Link to={`/post/${_id}`}>
                    <img className="landing-image" src={`http://localhost:4000/${cover}`} alt={alt} />
                </Link>
            </div>
            <div className='texts'>
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a href="/" className="author">{authorName}</a>
                    <time className="date">{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
                </p>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
