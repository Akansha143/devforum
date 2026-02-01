import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Search from './pages/Search';
import Trending from './pages/Trending';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !currentUser ? children : <Navigate to="/" />;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* SHOW NAVBAR ALWAYS */}
      <Navbar />
      
      <div className="flex">
        {/* SHOW SIDEBAR ONLY WHEN LOGGED IN */}
        {currentUser && <Sidebar />}
        
        {/* ADJUST MARGIN BASED ON SIDEBAR */}
        <main className={`flex-1 pt-16 pb-16 lg:pb-0 ${currentUser ? 'lg:ml-64' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/search" element={<Search />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      
      {/* SHOW BOTTOM NAV ONLY WHEN LOGGED IN */}
      {currentUser && <BottomNav />}
    </div>
  );
}

export default App;