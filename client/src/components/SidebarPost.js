import { Link } from "react-router-dom";

export default function SidebarPost({_id,content,cover,createdAt,summary,title,author}){
    return (
      <div className='sidebar-post'>
          <div className='sidebar-image'>
            <Link to={`/post/${_id}`}>
              <img src={'http://localhost:4000/'+cover} />
            </Link>
          </div>
          <div className='sidebar-texts'>
              <Link to={`/post/${_id}`}>
                  <h2>{title}</h2>
                  <p className="sidebar-summary">{summary}</p>
              </Link>
          </div>
      </div>
    );
};