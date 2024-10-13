import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-parchment">
      <Head>
        <title>Character Sheet App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-medieval text-brown-800 text-center mb-8">
          Character Sheet App
        </h1>
        <div className="text-center">
          <Link href="/characters">
            <a className="bg-brown-600 text-white px-6 py-3 rounded-lg text-lg font-medieval hover:bg-brown-700 transition-colors">
              View Characters
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home