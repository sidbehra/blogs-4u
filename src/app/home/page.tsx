'use client'

import { useState } from "react";
import allBlogs from "@/data/allBlogs";
import { Blog } from "@/types/blogTypes";

export default function Home() {    

  const [blogs, setBlogs] = useState<Blog[]>(allBlogs);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This is the main content area.</p>
      {
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {blogs.map((blog, index) => (
            <li key={index}>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-2xl font-bold">{blog.title}</h2>
                <p className="mt-2">{blog.content}</p>
              </div>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}