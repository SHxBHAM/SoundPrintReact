"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import P5Wrapper from "../components/p5Wrapper"
import Header from "../components/Header"
import Footer from "../components/Footer"

const ResultPage = () => {
  const [isMinting, setIsMinting] = useState(false)
  const [isMinted, setIsMinted] = useState(false)

  const handleMint = () => {
    setIsMinting(true)
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false)
      setIsMinted(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-xl font-bold mb-2">YOUR SOUNDPRINT</h1>
              <p className="text-xs text-zinc-400">A unique representation of your musical identity</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-square w-full border border-zinc-900 p-4 relative">
                <div className="w-full h-full bg-black">
                  <P5Wrapper />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-sm font-bold">DETAILS</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">CREATED</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">BASED ON</span>
                      <span>TOP 50 TRACKS</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">DOMINANT GENRES</span>
                      <span>ELECTRONIC, INDIE</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">STATUS</span>
                      <span>{isMinted ? "MINTED" : "UNMINTED"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold">HASH</h2>
                  <p className="text-xs font-mono text-zinc-400 break-all">
                    22958e79d9a12d55cf15f891d44bccefbac5c0ababcff12dc4337cb666845296
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleMint}
                    disabled={isMinting || isMinted}
                    className="w-full bg-white text-black hover:bg-[#c49f08] rounded-none py-6 text-xs font-normal"
                  >
                    {isMinting ? "MINTING ON ICP..." : isMinted ? "MINTED" : "MINT NFT ON ICP"}
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <Button className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-6 text-xs font-normal">
                      DOWNLOAD
                    </Button>
                    <Button className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-6 text-xs font-normal">
                      SHARE
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24 border-t border-zinc-900 pt-12">
              <div className="text-center mb-12">
                <h2 className="text-sm font-bold mb-2">TOP TRACKS USED</h2>
                <p className="text-xs text-zinc-400">These tracks were used to generate your SoundPrint</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center p-3 border border-zinc-900">
                    <div className="w-8 text-xs text-zinc-500 mr-4">{(i + 1).toString().padStart(2, "0")}</div>
                    <div className="flex-1">
                      <h3 className="text-xs font-medium">Track Title {i + 1}</h3>
                      <p className="text-xs text-zinc-500">Artist Name</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ResultPage

