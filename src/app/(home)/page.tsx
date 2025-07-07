'use client';

import React, { useState } from 'react';

// Types
interface Blog {
  blogId: string;
  title: string;
  content: string;
  authorName: string;
  publishedOn: string;
  lastUpdated: string;
  tags: string[];
  isPublished: boolean;
}

// Add/Edit Blog Form Component
const BlogForm = ({ 
  blog, 
  onSave, 
  onCancel, 
  isEditing = false 
}: {
  blog?: Blog;
  onSave: (blogData: Omit<Blog, 'blogId' | 'publishedOn' | 'lastUpdated'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    content: blog?.content || '',
    authorName: blog?.authorName || '',
    tags: blog?.tags?.join(', ') || '',
    isPublished: blog?.isPublished || false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const blogData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      authorName: formData.authorName.trim(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublished: formData.isPublished
    };

    onSave(blogData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter blog title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Author Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Name *
          </label>
          <input
            type="text"
            name="authorName"
            value={formData.authorName}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.authorName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter author name"
          />
          {errors.authorName && <p className="mt-1 text-sm text-red-600">{errors.authorName}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
              errors.content ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Write your blog content here..."
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter tags separated by commas (e.g., technology, programming, web)"
          />
          <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
        </div>

        {/* Published Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            Publish this blog post
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ 
  isOpen, 
  blogTitle, 
  onConfirm, 
  onCancel 
}: {
  isOpen: boolean;
  blogTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Delete Blog Post
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{blogTitle}"? This action cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Home Component with CRUD operations
const EnhancedHome = () => {
  // Mock data - replace with your actual allBlogs import
  const [blogs, setBlogs] = useState<Blog[]>([
    {
      blogId: "1",
      title: "Sample Blog Post",
      content: "This is a sample blog post content. You can edit or delete this post using the buttons below.",
      authorName: "John Doe",
      publishedOn: "2024-01-15",
      lastUpdated: "2024-01-15",
      tags: ["sample", "demo", "test"],
      isPublished: true
    },
    {
      blogId: "2",
      title: "Another Sample Post",
      content: "This is another sample blog post to demonstrate the CRUD functionality.",
      authorName: "Jane Smith",
      publishedOn: "2024-01-14",
      lastUpdated: "2024-01-14",
      tags: ["example", "crud"],
      isPublished: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, blogId: string, title: string}>({
    isOpen: false,
    blogId: '',
    title: ''
  });

  // Generate unique ID for new blogs
  const generateBlogId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Create new blog
  const handleCreateBlog = (blogData: Omit<Blog, 'blogId' | 'publishedOn' | 'lastUpdated'>) => {
    const newBlog: Blog = {
      ...blogData,
      blogId: generateBlogId(),
      publishedOn: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    setBlogs(prev => [newBlog, ...prev]);
    setShowForm(false);
  };

  // Update existing blog
  const handleUpdateBlog = (blogData: Omit<Blog, 'blogId' | 'publishedOn' | 'lastUpdated'>) => {
    if (!editingBlog) return;

    setBlogs(prev => prev.map(blog => 
      blog.blogId === editingBlog.blogId 
        ? {
            ...blog,
            ...blogData,
            lastUpdated: new Date().toISOString()
          }
        : blog
    ));
    
    setEditingBlog(null);
    setShowForm(false);
  };

  // Delete blog
  const handleDeleteBlog = (blogId: string) => {
    setBlogs(prev => prev.filter(blog => blog.blogId !== blogId));
    setDeleteModal({ isOpen: false, blogId: '', title: '' });
  };

  // Open delete confirmation
  const openDeleteModal = (blogId: string, title: string) => {
    setDeleteModal({ isOpen: true, blogId, title });
  };

  // Start editing
  const startEditing = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  // Cancel form
  const cancelForm = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const publishedBlogs = blogs.filter(blog => blog.isPublished);

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <BlogForm
          blog={editingBlog || undefined}
          onSave={editingBlog ? handleUpdateBlog : handleCreateBlog}
          onCancel={cancelForm}
          isEditing={!!editingBlog}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Blogs 4u</h1>
            <p className="text-gray-600 mt-2">Create, edit, and manage your blog posts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Create New Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Total Posts</h3>
            <p className="text-3xl font-bold text-blue-600">{blogs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Published</h3>
            <p className="text-3xl font-bold text-green-600">{publishedBlogs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900">Drafts</h3>
            <p className="text-3xl font-bold text-orange-600">{blogs.length - publishedBlogs.length}</p>
          </div>
        </div>

        {/* Blog List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.blogId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    blog.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditing(blog)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog.blogId, blog.title)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {blog.content}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{blog.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>By {blog.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(blog.publishedOn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {blog.lastUpdated !== blog.publishedOn && (
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-xs">
                        Updated {new Date(blog.lastUpdated).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(blog)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(blog.blogId, blog.title)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 text-sm mb-6">Get started by creating your first blog post.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        blogTitle={deleteModal.title}
        onConfirm={() => handleDeleteBlog(deleteModal.blogId)}
        onCancel={() => setDeleteModal({ isOpen: false, blogId: '', title: '' })}
      />
    </div>
  );
};

export default EnhancedHome;