"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const GeneratePage = () => {
  const navigate = useNavigate()
  const [stage, setStage] = useState<"analyzing" | "hashing" | "generating" | "complete">("analyzing")
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("ANALYZING YOUR MUSIC")

  useEffect(() => {
    // Simulate the generation process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 0.5
      })

      // Change stages at certain intervals
      if (progress < 33) {
        setStage("analyzing")
        setLoadingText("ANALYZING YOUR MUSIC")
      } else if (progress < 66) {
        setStage("hashing")
        setLoadingText("GENERATING SHA256 HASH")
      } else if (progress < 100) {
        setStage("generating")
        setLoadingText("CREATING WAVEFORM")
      } else {
        setStage("complete")
        setLoadingText("COMPLETE")
      }
    }, 50)

    return () => clearInterval(interval)
  }, [progress])

  // Navigate to result page when complete
  useEffect(() => {
    if (stage === "complete") {
      const timer = setTimeout(() => {
        navigate("/result")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [stage, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
      <div className="w-full max-w-md px-4">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-xs">{loadingText}</span>
          <span className="text-xs">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full h-[2px] bg-zinc-900">
          <div
            className="h-full bg-[#c49f08] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {stage === "analyzing" && (
          <div className="mt-16 text-center">
            <p className="text-xs text-zinc-400 mb-2">ANALYZING TOP TRACKS</p>
            <div className="space-y-2 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[1px] w-full bg-zinc-900">
                  <div
                    className="h-full bg-zinc-700 transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progress * 3, 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "hashing" && (
          <div className="mt-16 text-center">
            <p className="text-xs text-zinc-400 mb-2">CREATING UNIQUE IDENTIFIER</p>
            <div className="font-mono text-xs mt-8 text-zinc-500 overflow-hidden h-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="mb-1">
                  {Array.from({ length: 32 })
                    .map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)])
                    .join("")}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "generating" && (
          <div className="mt-16 text-center">
            <p className="text-xs text-zinc-400 mb-2">GENERATING WAVEFORM</p>
            <div className="h-40 w-full mt-8 flex items-center justify-center">
              <div className="w-full h-[60px] relative">
                {Array.from({ length: 50 }).map((_, i) => {
                  const height = Math.sin(i * 0.2 + progress * 0.05) * 20 + 30
                  return (
                    <div
                      key={i}
                      className="absolute bottom-0 bg-[#820303]"
                      style={{
                        height: `${height}px`,
                        width: "1px",
                        left: `${i * 2}%`,
                        opacity: progress > 80 ? 1 : 0.5,
                      }}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeneratePage

