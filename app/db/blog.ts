import fs from 'node:fs'
import path from 'node:path'

interface Metadata {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  // eslint-disable-next-line regexp/no-super-linear-backtracking
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter(file => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function extractTweetIds(content) {
  const tweetMatches = content.match(/<StaticTweet\sid="\d+"\s\/>/g)
  return tweetMatches?.map(tweet => tweet.match(/\d+/g)[0]) || []
}

function getMDXData(dir) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    const tweetIds = extractTweetIds(content)
    return {
      metadata,
      slug,
      tweetIds,
      content,
    }
  })
}

export function getBlogPosts() {
  // eslint-disable-next-line node/prefer-global/process
  return getMDXData(path.join(process.cwd(), 'content'))
}
