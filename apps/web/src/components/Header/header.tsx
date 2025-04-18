import Link from 'next/link'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { config } from './header.config'
import Button from '@/components/Button'

export const Header = ({ children }: React.PropsWithChildren) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 ">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">{config.title}</span>
          </Link>
        </div>
        {children}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={config.githubUrl} target="_blank" rel="noreferrer noopener nofollow">
                <GitHubLogoIcon width={config.iconSize} height={config.iconSize} />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
