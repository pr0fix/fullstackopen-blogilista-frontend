import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Login from "./components/Login";
import Logout from "./components/Logout";
import ShowNotification from "./components/ShowNotification";
import AddBlog from "./components/AddBlog";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const showNotification = (text, status, timeout) => {
    setMessage({ text, status, timeout });
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const addBlog = async (e) => {
    e.preventDefault();
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    };

    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      setNewBlog({ title: "", author: "", url: "" });
      showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        "success",
        3000
      );
    } catch (err) {
      showNotification("error in adding a new blog", "error", 3000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`logged in as ${user.name}`, "success", 3000);
    } catch (err) {
      showNotification("wrong username or password", "error", 3000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
    blogService.setToken(null);
    showNotification("successfully logged out", "success", 3000);
  };

  return (
    <>
      <ShowNotification message={message} setMessage={setMessage} />
      {!user && (
        <Login
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}

      {user && (
        <>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            {<Logout handleLogout={handleLogout} />}
          </p>
          <h2>create new</h2>
          {
            <AddBlog
              newBlog={newBlog}
              setNewBlog={setNewBlog}
              addBlog={addBlog}
            />
          }
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </>
  );
};

export default App;
