import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";
import { useContext} from "react";
import { UserContext } from "../UserContext";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);
  const [alt,setAlt] = useState('');
  const {setUserInfo, userInfo} = useContext(UserContext);
  const username = userInfo?.username;
  const isAdmin = userInfo?.admin;

  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          setAlt(postInfo.alt);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    data.set('alt', alt);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }
  if (!isAdmin) {
    alert('Must be an active admin to create a a post')
    return <Navigate to={'/'} />
  }else if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form className="edit-post-form" onSubmit={updatePost} >
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <input 
        type="alt"
        placeholder={'alt'}
         value={alt}
         onChange={ev => setAlt(ev.target.value)}
         />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'50px'}}>Update post</button>
    </form>
  );
}