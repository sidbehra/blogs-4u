'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import allBlogs from "@/data/allBlogs";
import { Blog } from "@/types/blogTypes";

export default function Home() {    
  const [blogs, setBlogs] = useState<Blog[]>(allBlogs);
  const router = useRouter();

  const handleBlogClick = (blogId: string) => {
    router.push(`/home/blog/${blogId}`);
  };

  // Filter only published blogs
  const publishedBlogs = blogs.filter(blog => blog.isPublished);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-2">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg mb-8">This is the main content area.</p>
      
      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Latest Blogs</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedBlogs.map((blog) => (
            <li key={blog.blogId}>
              <div 
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200 h-full flex flex-col"
                onClick={() => handleBlogClick(blog.blogId)}
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-3">
                  {blog.content}
                </p>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{blog.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {blog.authorName}</span>
                    <span>{new Date(blog.publishedOn).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}