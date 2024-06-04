import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "very important test blog",
    author: "test author III",
    url: "testurl.com",
    likes: 56,
  };

  const user = {
    username: "testUser"
  }

  const updateBlog = vi.fn();
  const deleteBlog = vi.fn();

  test("renders blog title and author but not url or likes by default", () => {
    render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>);

    const title = screen.getByText(/very important test blog/i);
    const author = screen.getByText(/test author III/i);
    expect(title).toBeInTheDocument();
    expect(author).toBeInTheDocument();

    const url = screen.queryByText(/testurl.com/i);
    const likes = screen.queryByText(/likes/i);
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });
});
