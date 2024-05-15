import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Workflow tools',
  description:
    'Tools I use to speed up my developing and designing process.',
}

export default function UsesPage() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        Workflow tools
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
        <h3 id="coding">Coding</h3>
        <ul>
          <li>
            Editor: VSCode (
            <Link href="https://gist.github.com/disin8/cd481c872186bd1e22863d9dd4898e19" target="_blank">
              Settings / Extensions
            </Link>
            )
          </li>
          <li>Theme: Dark Modern</li>
          <li>Terminal: Git bash</li>
          <li>
            Extensions:
            <ul style={{ listStyleType: 'square' }}>
              <li>
                <Link href="https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens" target="_blank">
                  Git Lens
                </Link>
              </li>
              <li>
                <Link href="https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost" target="_blank">
                  Import Cost
                </Link>
              </li>
              <li>
                <Link href="https://marketplace.visualstudio.com/items?itemName=silvenon.mdx" target="_blank">
                  MDX
                </Link>
              </li>
              <li>
                <Link href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint" target="_blank">
                  ESLint
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <h3 id="software">Software</h3>
        <ul>
          <li>
            <Link href="https://1password.com/" target="_blank">
              1Password
            </Link>
          </li>
          <li>
            <Link href="https://linear.app/" target="_blank">
              Linear
            </Link>
          </li>
          <li>
            <Link href="https://insomnia.rest/" target="_blank">
              Insomnia
            </Link>
          </li>
          <li>
            <Link href="https://slack.com/" target="_blank">
              Slack
            </Link>
          </li>
          <li>
            <Link href="https://zoom.us/" target="_blank">
              Zoom
            </Link>
          </li>
          <li>
            <Link href="https://responsively.app/" target="_blank">
              Responsive App
            </Link>
          </li>
          <li>Spotify</li>
          <li>Grammarly</li>
        </ul>
      </div>
    </section>
  )
}
