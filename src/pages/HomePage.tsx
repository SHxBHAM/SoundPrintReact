"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import Header from "../components/Header"
import Footer from "../components/Footer"

const HomePage = () => {
  const navigate = useNavigate()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleAuthenticate = async () => {
    setIsAuthenticating(true)
    // In a real implementation, this would trigger passkey authentication
    // For now, we'll simulate the process
    setTimeout(() => {
      navigate("/generate")
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-mono">
      <Header />

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                YOUR MUSIC TASTE AS A UNIQUE DIGITAL ASSET
              </h1>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Transform your music listening history into a one-of-a-kind NFT. Your musical identity, visualized
                through algorithmic waveforms.
              </p>
              <div className="pt-4">
                <Button
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating}
                  className="bg-white text-black hover:bg-[#c49f08] rounded-none px-8 py-6 text-xs font-normal"
                >
                  {isAuthenticating ? "AUTHENTICATING..." : "SIGN IN WITH PASSKEY"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 border-t border-zinc-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-12 text-center">ABOUT</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">UNIQUE IDENTITY</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your music taste is as unique as your fingerprint. We transform your listening data into a SHA256
                    hash, ensuring your NFT is truly one-of-a-kind.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">ALGORITHMIC ART</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Using Perlin noise algorithms, we generate beautiful 3D visualizations that represent your musical
                    identity in a visually striking way.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">ICP BLOCKCHAIN</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Each SoundPrint is minted as an NFT on the Internet Computer Protocol (ICP) hub chain, providing
                    verifiable proof of your unique musical taste.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">EVOLVING COLLECTION</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    As your music taste evolves, create new SoundPrints to document your journey through different
                    genres and artists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="py-20 border-t border-zinc-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-12 text-center">HOW IT WORKS</h2>
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 w-16 h-16 border border-zinc-800 flex items-center justify-center text-xl font-bold">
                    01
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold">AUTHENTICATE</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Sign in securely using passkeys - no password required. This provides a secure and seamless
                      authentication experience.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 w-16 h-16 border border-zinc-800 flex items-center justify-center text-xl font-bold">
                    02
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold">ANALYZE MUSIC</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      We analyze your music data and create a unique SHA256 hash that represents your specific taste
                      profile.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 w-16 h-16 border border-zinc-800 flex items-center justify-center text-xl font-bold">
                    03
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold">GENERATE VISUALIZATION</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Your hash is used as a seed for our Perlin noise algorithm, generating a unique 3D visualization
                      that represents your music taste.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 w-16 h-16 border border-zinc-800 flex items-center justify-center text-xl font-bold">
                    04
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold">MINT ON ICP</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Your SoundPrint is minted as an NFT on the Internet Computer Protocol (ICP) hub chain, creating a
                      permanent record of your musical identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage

