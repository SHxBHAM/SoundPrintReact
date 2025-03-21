import { useState } from "react";

export default function Naya() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="min-h-[40vh] w-full p-8 space-y-8">
      {/* Header */}
      <div className="w-full border-t border-b border-zinc-800/50 py-6 mb-12 text-white">
        <p className="text-center text-zinc-400">
          A simple process to create your unique sound identity
        </p>
      </div>

      {/* FAQ-style Steps - hover to expand */}
      <div className="max-w-5xl mx-auto">
        {[
          {
            num: "01",
            title: "AUTHENTICATE",
            desc: "Sign in with Spotify",
            details: "Connect your Spotify account to access your listening history. We use this data to create your unique musical fingerprint, all while keeping your information secure and private."
          },
          {
            num: "02",
            title: "ANALYZE MUSIC",
            desc: "Get your SHA256 hash",
            details: "Our algorithm analyzes your listening patterns and generates a SHA256 hash that captures the essence of your musical taste. This hash is unique to you and forms the foundation of your SoundPrint."
          },
          {
            num: "03",
            title: "GENERATE WAVEFORM",
            desc: "From your hash",
            details: "Using your unique hash, we create a visually stunning 3D waveform visualization. This algorithmic art represents your musical identity with distinctive patterns and shapes derived from your listening history."
          },
          {
            num: "04",
            title: "MINT",
            desc: "Your Waveform on the ICP",
            details: "With a single click, your SoundPrint is minted as an NFT on the Internet Computer Protocol blockchain. This creates a permanent, verifiable record of your musical identity that you can share, display, or hold onto as your taste evolves."
          },
        ].map(({ num, title, desc, details }, index, array) => (
          <div 
            key={num} 
            className="flex flex-col"
            onMouseEnter={() => setHoveredItem(num)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Main heading row */}
            <div
              className={`border-l border-r ${index === 0 ? 'border-t' : ''} border-zinc-800/50 bg-zinc-900/20 text-white overflow-hidden transition-all duration-500 cursor-pointer h-[80px] flex items-center relative`}
            >
              {/* Number identifier */}
              <div className={`text-zinc-600 text-xl font-mono ml-6 mr-8 w-12 transition-all duration-500 ${hoveredItem === num ? 'text-zinc-400' : ''}`}>
                {num}
              </div>
              
              {/* Title */}
              <h3 className={`text-4xl font-bold text-zinc-200 tracking-wide transition-all duration-500 flex-1 ${hoveredItem === num ? 'text-zinc-100' : ''}`}>
                {title}
              </h3>
              
              {/* Description - shows on hover */}
              <div className={`text-zinc-300 absolute right-16 text-lg font-light transition-all duration-500 ${
                hoveredItem === num ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
              }`}>
                {desc}
              </div>
              
              {/* Arrow indicator */}
              <div className={`text-zinc-600 mr-6 text-2xl transition-all duration-300 transform ${hoveredItem === num ? 'rotate-180' : ''}`}>
                ↓
              </div>
            </div>
            
            {/* Expanded content - shows on hover */}
            <div className={`border-l border-r ${hoveredItem === num && index === array.length - 1 ? 'border-b' : ''} border-zinc-800/50 bg-zinc-900/20 px-6 py-4 overflow-hidden transition-all duration-500 ${
              hoveredItem === num ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 py-0 border-b-0'
            }`}>
              <p className="text-zinc-300 pl-20">
                {details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
