import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getSpotifyAuthUrl } from "../services/spotify";
import Naya from "../components/Naya";
import Vortex from "../components/Vortex";
import { useInternetIdentity } from "ic-use-internet-identity";

export default function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login, loginStatus, clear } = useInternetIdentity();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount and when it changes
  useEffect(() => {
    // First check localStorage to see if we were previously logged in
    const storedLoginState = localStorage.getItem("isLoggedIn");

    if (storedLoginState === "true") {
      setIsLoggedIn(true);
    }

    // Then check current login status from the hook
    if (loginStatus === "success" || loginStatus === "logged-in") {
      console.log(loginStatus);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    }
    if (loginStatus === "error") {
      console.log(loginStatus);
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
    }

    console.log(
      "Current login status:",
      loginStatus,
      "\nIs logged in:",
      isLoggedIn
    );
  }, [loginStatus]);

  // Additional check for URL parameters that might indicate a Spotify auth callback
  useEffect(() => {
    // Check if we're coming back from Spotify (URL might have error or code params)
    const urlParams = new URLSearchParams(window.location.search);
    const hasSpotifyParams = urlParams.has("error") || urlParams.has("code");

    if (hasSpotifyParams && localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    // If already logged in, redirect to Spotify directly
    if (isLoggedIn) {
      window.location.href = getSpotifyAuthUrl();
      return;
    }

    // Otherwise, initiate login process
    setIsAuthenticating(true);

    try {
      await login();

      // After login attempt, check status again
      if (
        loginStatus === "success" ||
        loginStatus === "logged-in" ||
        loginStatus === "idle"
      ) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        console.error("Login failed with status:", loginStatus);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleContinueToSpotify = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  const handleLogout = () => {
    // Clear the stored login state
    clear();
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    // You could also call a logout function from useInternetIdentity if available
  };

  // Render the appropriate button based on login state
  const renderActionButton = () => {
    if (isAuthenticating) {
      return (
        <Button
          disabled
          className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 text-white px-10 py-6 text-sm font-normal transition-all duration-500"
        >
          Logging in...
        </Button>
      );
    }

    if (isLoggedIn) {
      return (
        <Button
          onClick={handleContinueToSpotify}
          className="bg-green-700/70 backdrop-blur-sm border border-green-600/50 text-white hover:bg-green-700 hover:border-green-600 px-10 py-6 text-sm font-normal transition-all duration-500"
        >
          Continue to Spotify
        </Button>
      );
    }

    return (
      <Button
        onClick={handleLogin}
        className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 text-white hover:bg-zinc-900 hover:border-zinc-700 px-10 py-6 text-sm font-normal transition-all duration-500"
      >
        Sign In
      </Button>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-zinc-900/90 text-white font-mono">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Vortex */}
        <Vortex
          particleCount={700}
          baseHue={220} // Blue color scheme
          baseSpeed={0.2}
          rangeSpeed={2}
          baseRadius={1}
          rangeRadius={1.5}
          backgroundColor="rgba(0,0,0,0)" // Transparent background
          containerClassName="h-[90vh]"
        >
          <section className="py-32 md:py-40 w-full">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center space-y-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-zinc-200 to-white bg-clip-text text-transparent">
                  YOUR MUSIC TASTE AS A UNIQUE DIGITAL ASSET
                </h1>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg">
                  Transform your music listening history into a one-of-a-kind
                  NFT. Your musical identity, visualized through algorithmic
                  waveforms.
                </p>
                <div className="pt-6">{renderActionButton()}</div>

                {isLoggedIn && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-green-400 text-sm mb-2">
                      You're logged in! Click the button above to connect with
                      Spotify.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-zinc-500 text-xs underline hover:text-zinc-300"
                    >
                      Sign out
                    </button>
                  </div>
                )}
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
