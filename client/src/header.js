import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      })
    })
  }, []);

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

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <nav>
      <Link to="/" className="logo">MMA OMEN</Link>
        <div className="left-links">
          <Link to="/mma">MMA</Link>
          <Link to="/ufc">UFC</Link>
          <Link to="/muay-thai">Muay Thai</Link>
          <Link to="/bjj">Jui Jitzu</Link>
          <Link to="/boxing">Boxing</Link>
          <Link to="/more">More</Link>
        </div>
        <div className="right-links">
          {userInfo?.admin ? (
            <>
              <Link to="/create">Create new post</Link>
              <a href="" onClick={logout}>Logout</a>
            </>
          ) : username ? (
            <>
              <a href="" onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
