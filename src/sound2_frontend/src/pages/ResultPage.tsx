import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../components/ui/button";
import P5Wrapper, { P5WrapperHandle } from "../components/p5Wrapper";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import {
  getTopTracks,
  getTopGenres,
  clearAccessToken,
} from "../services/spotify";
import { useNavigate } from "react-router-dom";
import { useInternetIdentity } from "ic-use-internet-identity";
import { createBackendActor } from "../utils/icpAgent";

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
  const { clear, loginStatus } = useInternetIdentity();
  const [mintError, setMintError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [initialLoadCheck, setInitialLoadCheck] = useState(true);
  const timeoutRef = useRef<number | null>(null); // Ref to store the timeout ID

  // Modified function to check if the NFT already exists - resolve immediately
  const checkIfNftExists = useCallback(async (hash: string) => {
    if (!hash || hash === "error") return;

    // Clear any existing timeout first
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsCheckingStatus(true);

    // Start the backend query immediately with no artificial delay
    try {
      const backendActor = createBackendActor();
      const exists = await backendActor.nft_exists(hash);

      if (exists) {
        console.log("NFT already exists with hash:", hash);
        setIsMinted(true);
      }

      // Update immediately when done
      setIsCheckingStatus(false);
    } catch (error) {
      console.error("Error checking NFT existence:", error);
      setIsCheckingStatus(false);
    }
  }, []);

  // Update fetchTopTracks to remove localStorage checks
  const fetchTopTracks = useCallback(async () => {
    if (hasAttemptedFetch && !error) return;

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
        const hash = genreData.hash;
        setDominantGenres(genreData.genres);
        setGenreHash(hash);

        // Check NFT existence with backend
        checkIfNftExists(hash);
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
  }, [navigate, hasAttemptedFetch, error, checkIfNftExists]);

  // Also check NFT existence when genreHash changes independently
  useEffect(() => {
    if (genreHash && genreHash !== "error" && !isMinted) {
      checkIfNftExists(genreHash);
    }
  }, [genreHash, checkIfNftExists, isMinted]);

  useEffect(() => {
    fetchTopTracks();

    // Set a consistent timeout for the initial load check
    setTimeout(() => {
      setInitialLoadCheck(false);
    }, 1500); // 1.5 seconds for a smoother experience
  }, [fetchTopTracks]);

  // Update handleMint to remove localStorage operations
  const handleMint = async () => {
    setIsMinting(true);
    setMintError(null);

    try {
      // Generate image URL from canvas
      // @ts-ignore
      const imageUrl = p5Ref.current?.getBase64Image() || "";

      // Prepare metadata - needs to be an array of [key, value] pairs
      const metadata: [string, string][] = [
        ["createdAt", new Date().toISOString()],
        ["source", "Spotify"],
      ];

      // Create NFT name and description
      const nftName = `SoundPrint: ${dominantGenres.split(",")[0]}`;
      const nftDescription = `A unique audio fingerprint generated from top Spotify tracks. Dominant genres: ${dominantGenres}`;

      // Create backend actor
      const backendActor = createBackendActor();

      // Call mint_nft with the correct parameter format
      const result = await backendActor.mint_nft(
        genreHash,
        nftName,
        nftDescription,
        imageUrl,
        metadata
      );

      console.log("NFT minted successfully:", result);
      handleDownload();
      setIsMinted(true);

      // No more localStorage saves
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintError(
        error instanceof Error ? error.message : "Failed to mint NFT"
      );
    } finally {
      setIsMinting(false);
    }
  };

  const handleLogout = () => {
    clear();
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
                      <span>
                        {isCheckingStatus || initialLoadCheck
                          ? "LOADING..."
                          : isMinted
                          ? "MINTED"
                          : "UNMINTED"}
                      </span>
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
                    disabled={
                      isMinting ||
                      isMinted ||
                      isCheckingStatus ||
                      initialLoadCheck || // Add this condition
                      !genreHash ||
                      genreHash === "error"
                    }
                    className="w-full bg-white text-black hover:bg-[#c49f08] rounded-none py-6 text-xs font-normal"
                  >
                    {initialLoadCheck || isCheckingStatus
                      ? "CHECKING STATUS..."
                      : isMinting
                      ? "MINTING ON ICP..."
                      : isMinted
                      ? "MINTED"
                      : "MINT NFT ON ICP"}
                  </Button>

                  {mintError && (
                    <div className="text-red-500 text-xs text-center">
                      {mintError}
                    </div>
                  )}

                  <div className="grid gap-4">
                    <Button
                      onClick={handleDownload}
                      disabled={initialLoadCheck || isCheckingStatus}
                      className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-none py-6 text-xs font-normal"
                    >
                      DOWNLOAD
                    </Button>
                  </div>
                  <Button
                    onClick={handleLogout}
                    disabled={initialLoadCheck || isCheckingStatus}
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
