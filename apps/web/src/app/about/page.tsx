import Button from '@/components/Button'
import Link from 'next/link'
import { config } from './page.config'

export default function About() {
  return (
    <div>
      <main className="flex flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-center">{config.title}</h1>
          <p className="text-lg text-center">{config.description}</p>
          <Link href={'/'}>
            <Button variant={'default'}>Home</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
