import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Status() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <h1>Status</h1>
    </main>
  )
}
