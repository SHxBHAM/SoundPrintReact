"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../components/ui/button";
import P5Wrapper, { P5WrapperHandle } from "../components/p5Wrapper";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getTopTracks,
  getTopGenres,
  clearAccessToken,
} from "../services/spotify";
import { useNavigate } from "react-router-dom";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
}

const ResultPage = () => {
  const navigate = useNavigate();
  const p5Ref = useRef<P5WrapperHandle>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [dominantGenres, setDominantGenres] = useState<string>("");
  const [genreHash, setGenreHash] = useState<string>("");

  const fetchTopTracks = useCallback(async () => {
    if (hasAttemptedFetch && !error) return; // Don't refetch if we already have tracks

    try {
      setError(null);
      setIsLoading(true);
      const [tracks, genreData] = await Promise.all([
        getTopTracks(10),
        getTopGenres(10),
      ]);
      if (tracks) {
        setTopTracks(tracks);
      }
      if (typeof genreData !== "string") {
        setDominantGenres(genreData.genres);
        setGenreHash(genreData.hash);
      } else {
        setDominantGenres(genreData);
        setGenreHash("error");
      }
      setHasAttemptedFetch(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch data";
      setError(errorMessage);
      if (errorMessage.includes("session expired")) {
        setTimeout(() => navigate("/home"), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, hasAttemptedFetch, error]);

  useEffect(() => {
    fetchTopTracks();
  }, [fetchTopTracks]);

  const handleMint = () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
    }, 3000);
  };

  const handleLogout = () => {
    clearAccessToken();
    navigate("/home");
  };

  const handleDownload = () => {
    p5Ref.current?.downloadCanvas();
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-xl font-bold mb-2">YOUR SOUNDPRINT</h1>
              <p className="text-xs text-zinc-400">
                A unique representation of your musical identity
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-square w-full border border-zinc-900 p-4 relative">
                <div className="w-full h-full bg-black">
                  <P5Wrapper ref={p5Ref} />
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
                      <span>{dominantGenres || "LOADING..."}</span>
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
                    {genreHash || "Loading..."}
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleMint}
                    disabled={isMinting || isMinted}
                    className="w-full bg-white text-black hover:bg-[#c49f08] rounded-none py-6 text-xs font-normal"
                  >
                    {isMinting
                      ? "MINTING ON ICP..."
                      : isMinted
                      ? "MINTED"
                      : "MINT NFT ON ICP"}
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-6 text-xs font-normal"
                    >
                      DOWNLOAD
                    </Button>
                    <Button className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-6 text-xs font-normal">
                      SHARE
                    </Button>
                  </div>

                  <Button
                    onClick={handleLogout}
                    className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-6 text-xs font-normal text-red-500 hover:text-red-400"
                  >
                    DISCONNECT SPOTIFY
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-24 border-t border-zinc-900 pt-12">
              <div className="text-center mb-12">
                <h2 className="text-sm font-bold mb-2">TOP TRACKS USED</h2>
                <p className="text-xs text-zinc-400">
                  These tracks were used to generate your SoundPrint
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-2 text-center text-xs text-zinc-400">
                    Loading your top tracks...
                  </div>
                ) : error ? (
                  <div className="col-span-2 text-center">
                    <div className="text-red-500 text-xs mb-4">{error}</div>
                    <Button
                      onClick={fetchTopTracks}
                      className="bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-2 text-xs font-normal"
                    >
                      RETRY
                    </Button>
                  </div>
                ) : (
                  topTracks.map((track, i) => (
                    <div
                      key={track.id}
                      className="flex items-center p-3 border border-zinc-900"
                    >
                      <div className="w-8 text-xs text-zinc-500 mr-4">
                        {(i + 1).toString().padStart(2, "0")}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-medium">{track.name}</h3>
                        <p className="text-xs text-zinc-500">{track.artist}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultPage;
