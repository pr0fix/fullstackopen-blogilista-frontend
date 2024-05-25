import React from "react";

export default function AddBlog({ newBlog, setNewBlog, addBlog }) {
  const handleAddNewBlog = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  return (
    <>
      <form id="addBlogForm" onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={handleAddNewBlog}
            value={newBlog.title}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            type="text"
            name="author"
            id="author"
            onChange={handleAddNewBlog}
            value={newBlog.author}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            type="text"
            name="url"
            id="url"
            onChange={handleAddNewBlog}
            value={newBlog.url}
          />
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </>
  );
}
