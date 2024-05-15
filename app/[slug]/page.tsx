import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { getBlogPosts } from 'app/db/blog'

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  const post = getBlogPosts().find(post => post.slug === params.slug)
  if (!post)
    return

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  const ogImage = image
    ? `https://devflow8.vercel.app${image}`
    : `https://devflow8.vercel.app/og?title=${title}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://devflow8.vercel.app/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

function formatDate(date: string) {
  const currentDate = new Date()
  if (!date.includes('T'))
    date = `${date}T00:00:00`

  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0)
    formattedDate = `${yearsAgo}y ago`
  else if (monthsAgo > 0)
    formattedDate = `${monthsAgo}mo ago`
  else if (daysAgo > 0)
    formattedDate = `${daysAgo}d ago`
  else
    formattedDate = 'Today'

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return `${fullDate} (${formattedDate})`
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()

  return posts.map(post => ({
    slug: post.slug,
  }))
}

export default function Blog({ params }) {
  const post = getBlogPosts().find(post => post.slug === params.slug)

  if (!post)
    notFound()

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.metadata.title,
            'datePublished': post.metadata.publishedAt,
            'dateModified': post.metadata.publishedAt,
            'description': post.metadata.summary,
            'image': post.metadata.image
              ? `https://devflow8.vercel.app${post.metadata.image}`
              : `https://devflow8.vercel.app/og?title=${post.metadata.title}`,
            'url': `https://devflow8.vercel.app/${post.slug}`,
            'author': {
              '@type': 'Person',
              'name': 'devtools',
            },
          }),
        }}
      />
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
      </div>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
