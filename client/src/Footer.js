import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";
import { useContext, useEffect} from "react";
import { UserContext } from "./UserContext";

export default function Footer() {
  const {setUserInfo, userInfo} = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response =>{
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
 // console.log(userInfo);
  function logout(){
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);

  }

    const username = userInfo?.username;

  return (
    <footer className="main-footer">
      {userInfo?.admin ? (
      <> <div className="above-footer">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
        <div className="footer-nav">
        <nav className="main-footer-one">
        <Link to="/create">Create new post</Link>
              <a href="" onClick={logout}>Logout</a>
        </nav>
        <nav className="main-footer-two">
          <Link to="/mma">MMA</Link><br />
          <Link to="/ufc">UFC</Link><br />
          <Link to="/muay-thai">Muay Thai</Link><br />
        </nav>
        <nav className="main-footer-three">
          <Link to="/contact">Contact Us</Link><br />
          <Link to="/advertising">Advertisement Contact</Link>
        </nav>
        <nav className="main-footer-four">
        <Link to="/jiu-jitsu">Jiu Jitsu</Link><br />
          <Link to="/boxing">Boxing</Link><br />
          <Link to="/more">More</Link>
        </nav>
      </div>
            </>
          ) : username ? (
            <>
         <div className="above-footer">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
        <div className="footer-nav">
        <nav className="main-footer-one">
        <a href="" onClick={logout}>Logout</a>
        </nav>
        <nav className="main-footer-two">
          <Link to="/mma">MMA</Link><br />
          <Link to="/ufc">UFC</Link><br />
          <Link to="/muay-thai">Muay Thai</Link><br />
        </nav>
        <nav className="main-footer-three">
          <Link to="/contact">Contact Us</Link><br />
          <Link to="/advertising">Advertisement Contact</Link>
        </nav>
        <nav className="main-footer-four">
        <Link to="/jiu-jitsu">Jiu Jitsu</Link><br />
          <Link to="/boxing">Boxing</Link><br />
          <Link to="/more">More</Link>
        </nav>
      </div>
            </>
          ) : (
            <>
        <div className="above-footer">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
        </div>
        <div className="footer-nav">
        <nav className="main-footer-one">
          <Link to="/login">Login</Link><br />
          <Link to="/register">Register</Link>
        </nav>
        <nav className="main-footer-two">
          <Link to="/mma">MMA</Link><br />
          <Link to="/ufc">UFC</Link><br />
          <Link to="/muay-thai">Muay Thai</Link><br />
        </nav>
        <nav className="main-footer-three">
          <Link to="/contact">Contact Us</Link><br />
          <Link to="/advertising">Advertisement Contact</Link>
        </nav>
        <nav className="main-footer-four">
        <Link to="/jiu-jitsu">Jiu Jitsu</Link><br />
          <Link to="/boxing">Boxing</Link><br />
          <Link to="/more">More</Link>
        </nav>
      </div>
            </>
          )}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
      
    </footer>
  );
}