export default function Naya() {
  return (
    <div className="min-h-[40vh] w-full p-8 space-y-8">
      {/* Header */}
      <div className="h-[25vh] w-full rounded-3xl border border-zinc-800/50 backdrop-blur-sm px-8 mb-6 text-white transition-all duration-700 hover:bg-zinc-900/50 group">
        <h1 className="pl-10 text-[2vh] pt-8 text-zinc-400 transition-all duration-700 group-hover:pt-8 group-hover:text-center group-hover:text-[12vh] group-hover:text-white/90">
          HOW IT WORKS
        </h1>
        <h1 className="text-[5vw] text-center bg-gradient-to-r from-zinc-200 to-white bg-clip-text text-transparent transition-all duration-700 group-hover:text-[1vh] group-hover:text-zinc-400">
          *YOUR MUSICAL IDENTITY*
        </h1>
      </div>

      {/* Steps Container */}
      <div className="grid gap-4">
        {[
          { num: "01", title: "AUTHENTICATE", desc: "Sign in with Spotify" },
          { num: "02", title: "ANALYZE MUSIC", desc: "Get your SHA256 hash" },
          { num: "03", title: "GENERATE WAVEFORM", desc: "From your hash" },
          { num: "04", title: "MINT", desc: "Your Waveform on the ICP" },
        ].map(({ num, title, desc }) => (
          <div
            key={num}
            className="h-[15vh] rounded-3xl border border-zinc-800/50 backdrop-blur-sm bg-zinc-900/20 text-white px-8 flex items-center transition-all duration-500 hover:bg-zinc-900/50 group hover:border-zinc-700"
          >
            <div className="flex items-center space-x-4 w-full">
              <span className="text-zinc-600 text-sm font-mono transition-all duration-500 group-hover:text-zinc-400">
                {num}
              </span>
              <h1 className="text-[4vw] text-zinc-400 transition-all duration-500 group-hover:font-thin group-hover:text-[2vh] group-hover:text-white/90">
                {title}
              </h1>
              <h1 className="pl-8 text-[1vw] font-thin text-zinc-500 transition-all duration-500 group-hover:text-[4vw] group-hover:font-medium group-hover:text-white/90 group-hover:pl-4">
                {desc}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
