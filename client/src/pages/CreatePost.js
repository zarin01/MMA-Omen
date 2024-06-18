import { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import Editor from "../Editor";
import { UserContext } from "../UserContext";

const sportsCategories = [
    "MMA","Muay Thai", "BJJ", "Wrestling", "Boxing",
    "Kickboxing", "Karate", "Taekwondo", "Judo", "Sambo"
];

const organizationCategories = [
    "UFC", "Bellator", "ONE Championship", "PFL", "Rizin",
    "Invicta FC", "Cage Warriors", "KSW", "ACA"
];

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [alt, setAlt] = useState('');
    const [sports, setSports] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo, userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAdminStatus() {
            const response = await fetch('http://localhost:4000/profile', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setUserInfo(data);
        }
        checkAdminStatus();
    }, [setUserInfo]);

    const handleSportChange = (event) => {
        const { value, checked } = event.target;
        setSports((prev) =>
            checked ? [...prev, value] : prev.filter((sport) => sport !== value)
        );
    };

    const handleOrganizationChange = (event) => {
        const { value, checked } = event.target;
        setOrganizations((prev) =>
            checked ? [...prev, value] : prev.filter((org) => org !== value)
        );
    };

    const wordCount = (text) => {
        return text.split(/\s+/).filter(Boolean).length;
    };

    const handleSummaryChange = (ev) => {
        const text = ev.target.value;
        if (wordCount(text) <= 50) {
            setSummary(text);
        } else {
            alert("Summary must be at most 50 words.");
        }
    };

    async function createNewPost(ev) {
        ev.preventDefault();
        if (!userInfo?.admin) {
            alert('Must be an active admin to create a post');
            navigate('/');
            return;
        }

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.append('file', files);
        data.set('alt', alt);
        data.set('sports', sports);
        data.set('organizations', organizations);

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
        });

        if (response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    if (!userInfo) {
        return null; // Render nothing or a loading indicator while the user info is being fetched
    }

    if (!userInfo.admin) {
        return <Navigate to="/" />; // Redirect non-admin users to the home page
    }

    return (
        <form className="create-post-form" onSubmit={createNewPost}>
            <input
                type="title"
                placeholder="Title"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <input
                type="summary"
                placeholder="Summary (max 50 words)"
                value={summary}
                onChange={handleSummaryChange}
            />
            <input type="file" onChange={ev => setFiles(ev.target.files[0])} />
            {files && <img src={URL.createObjectURL(files)} alt="Selected" style={{ marginTop: '10px', maxWidth: '200px', maxHeight: '200px' }} />}
            <input
                placeholder="Alt Tag"
                value={alt}
                onChange={ev => setAlt(ev.target.value)}
            />
            <Editor value={content} onChange={setContent} />

            <div className="categories">
                <div className="category-group">
                    <h3>Select Sports</h3>
                    {sportsCategories.map((cat) => (
                        <label key={cat} className="checkbox-label">
                            
                                <input
                                type="checkbox"
                                value={cat}
                                checked={sports.includes(cat)}
                                onChange={handleSportChange}
                            />
                           <div> {cat}</div>
                            
                            
                        </label>
                    ))}
                </div>
                <div className="category-group">
                    <h3>Select Organizations</h3>
                    {organizationCategories.map((cat) => (
                        
                        <label key={cat} className="checkbox-label">
                            <input
                                type="checkbox"
                                value={cat}
                                checked={organizations.includes(cat)}
                                onChange={handleOrganizationChange}
                            />
                            <div>{cat}</div>
                        </label>
                        
                    ))}
                </div>
            </div>

            <button style={{ marginTop: '45px' }}>Create Post</button>
        </form>
    );
}
