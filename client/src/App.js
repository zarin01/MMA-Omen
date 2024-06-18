import './App.css';
import Layout from './Layout';
import {Route, Routes} from "react-router-dom";
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
import SidebarComponent from './components/Sidebar';
import MuayThaiPage from './pages/sub/MuayThaiPage';
import MmaPage from './pages/sub/MmaPage';
import UfcPage from './pages/sub/UfcPage';
import BjjPage from './pages/sub/BjjPage';
import BoxingPage from './pages/sub/BoxingPage';
import MorePage from './pages/sub/MorePage';
import ContactPage from './pages/sub/ContactPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />}/>
          <Route path="/edit/:id" element={<EditPost />}/>
          <Route path="/edit/:id" element={<SidebarComponent />}/>
          <Route path="/mma" element={<MmaPage />}/>
          <Route path="/ufc" element={<UfcPage />}/>
          <Route path="/muay-thai" element={<MuayThaiPage />}/>
          <Route path="/bjj" element={<BjjPage />}/>
          <Route path="/boxing" element={<BoxingPage />}/>
          <Route path="/more" element={<MorePage />}/>
          <Route path="/contact" element={<ContactPage />}/>
        </Route>
      </Routes>
    </UserContextProvider>
    
    
  );
}

export default App;
