"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAccessTokenFromUrl, setAccessToken } from "../services/spotify"

const CallbackPage = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleToken = async () => {
      try {
        const token = await getAccessTokenFromUrl()
        if (token) {
          setAccessToken(token)
          navigate("/result")
        } else {
          setError("No access token received from Spotify")
          setTimeout(() => navigate("/home"), 3000)
        }
      } catch (err) {
        console.error('Authentication error:', err)
        setError(err instanceof Error ? err.message : "Authentication failed")
        setTimeout(() => navigate("/home"), 3000)
      }
    }

    handleToken()
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
      <div className="text-center">
        <h1 className="text-xl mb-4">AUTHENTICATING WITH SPOTIFY</h1>
        {error ? (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        ) : (
          <div className="w-48 h-[2px] bg-zinc-900">
            <div className="h-full bg-[#c49f08] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}

export default CallbackPage 