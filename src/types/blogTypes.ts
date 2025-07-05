export type Blog = {
  blogId: string,
  title: string,
  content: string,
  lastUpdated: string,
  publishedOn: string,
  authorName: string,
  isPublished: boolean,
  tags: string[]
}

export type Blogs = {
  allBlogs: Blog[]
}