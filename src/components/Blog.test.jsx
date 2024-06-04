import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog />", () => {
  const blog = {
    title: "very important test blog",
    author: "test author III",
    url: "testurl.com",
    likes: 56,
    user: {
      username: "testUser",
    },
  };

  const testUser = {
    username: "testUser",
  };

  const updateBlog = vi.fn();
  const deleteBlog = vi.fn();

  test("renders blog title and author but not url or likes by default", () => {
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        user={testUser}
      />
    );

    const title = screen.getByText(/very important test blog/i);
    const author = screen.getByText(/test author III/i);
    expect(title).toBeInTheDocument();
    expect(author).toBeInTheDocument();

    const url = screen.queryByText(/testurl.com/i);
    const likes = screen.queryByText(/likes/i);
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });

  test("renders all information about a blog when 'view'-button is pressed", async () => {
    render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        deleteBlog={deleteBlog}
        user={testUser}
      />
    );

    const title = screen.getByText(/very important test blog/i);
    const author = screen.getByText(/test author III/i);
    expect(title).toBeInTheDocument();
    expect(author).toBeInTheDocument();

    const user = userEvent.setup();
    const button = screen.getByText(/view/i);
    await user.click(button);

    const url = screen.getByText(/testurl.com/i);
    const likes = screen.getByText(/likes/i);
    expect(url).toBeInTheDocument();
    expect(likes).toBeInTheDocument();
  });
});
