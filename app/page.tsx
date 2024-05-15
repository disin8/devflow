import Link from 'next/link'
import { getBlogPosts } from 'app/db/blog'

export default function Page() {
  const allBlogs = getBlogPosts()

  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium tracking-tighter">
        Enhance your development workflow
        {' '}
        <span className="text-red-500">10x</span>
        .
      </h1>
      <div className="flex flex-col gap-4 sm:gap-0">
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
            )
              return -1

            return 1
          })
          .map(post => (
            <Link
              key={post.slug}
              className="-mx-3 flex flex-col rounded-md px-3 no-underline hover:bg-[#F4F4F4] dark:hover:bg-[#191919] sm:py-3"
              href={`/${post.slug}`}
            >
              <div className="w-full flex flex-col">
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {post.metadata.title}
                </p>
                <span className="text-neutral-500 font-light tracking-tight">
                  {post.metadata.summary}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  )
}
