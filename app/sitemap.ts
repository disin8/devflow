import { getBlogPosts } from 'app/db/blog'

export default async function sitemap() {
  const blogs = getBlogPosts().map(post => ({
    url: `https://devflow.github.io/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const routes = ['', '/tools'].map(route => ({
    url: `https://devflow.github.io${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
