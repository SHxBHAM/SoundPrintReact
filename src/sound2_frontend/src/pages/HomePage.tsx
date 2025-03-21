"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSpotifyAuthUrl } from "../services/spotify";
import Naya from "../components/Naya";
import Vortex from "../components/Vortex";

export default function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSpotifyLogin = () => {
    setIsAuthenticating(true);
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-zinc-900/90 text-white font-mono">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Vortex */}
        <Vortex
          particleCount={700}
          baseHue={220}  // Blue color scheme
          baseSpeed={0.2}
          rangeSpeed={2}
          baseRadius={1}
          rangeRadius={1.5}
          backgroundColor="rgba(0,0,0,0)"  // Transparent background
          containerClassName="h-[90vh]"
        >
          <section className="py-32 md:py-40 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center space-y-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-zinc-200 to-white bg-clip-text text-transparent">
                  YOUR MUSIC TASTE AS A UNIQUE DIGITAL ASSET
                </h1>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg">
                  Transform your music listening history into a one-of-a-kind NFT.
                  Your musical identity, visualized through algorithmic waveforms.
                </p>
                <div className="pt-6">
                  <Button
                    onClick={handleSpotifyLogin}
                    disabled={isAuthenticating}
                    className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 text-white hover:bg-zinc-900 hover:border-zinc-700 px-10 py-6 text-sm font-normal transition-all duration-500"
                  >
                    {isAuthenticating
                      ? "CONNECTING TO SPOTIFY..."
                      : "CONNECT WITH SPOTIFY"}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </Vortex>

        {/* About Section */}
        <section id="about" className="py-20 border-t border-zinc-800/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-16 text-center bg-gradient-to-r from-zinc-200 to-white bg-clip-text text-transparent">
                ABOUT
              </h2>
              <div className="grid gap-12 md:grid-cols-2">
                {[
                  {
                    title: "UNIQUE IDENTITY",
                    desc: "Your music taste is as unique as your fingerprint. We transform your listening data into a SHA256 hash, ensuring your NFT is truly one-of-a-kind.",
                  },
                  {
                    title: "ALGORITHMIC ART",
                    desc: "Using Perlin noise algorithms, we generate beautiful 3D visualizations that represent your musical identity in a visually striking way.",
                  },
                  {
                    title: "ICP BLOCKCHAIN",
                    desc: "Each SoundPrint is minted as an NFT on the Internet Computer Protocol (ICP) hub chain, providing verifiable proof of your unique musical taste.",
                  },
                  {
                    title: "EVOLVING COLLECTION",
                    desc: "As your music taste evolves, create new SoundPrints to document your journey through different genres and artists.",
                  },
                ].map(({ title, desc }) => (
                  <div
                    key={title}
                    className="space-y-4 p-8 border border-zinc-800/50 backdrop-blur-sm bg-zinc-900/20 transition-all duration-500 hover:bg-zinc-900/50 hover:border-zinc-700"
                  >
                    <h3 className="text-lg font-bold text-zinc-200">{title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="py-20 border-t border-zinc-800/50">
          <Naya />
        </section>
      </main>

      <Footer />
    </div>
  );
}
