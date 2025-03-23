import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING");
  const [isLoaded, setIsLoaded] = useState(false);

  const loadingPhrases = [
    'LOADING " MUSIC IS THE ANSWER "',
    "ANALYZING AUDIO PATTERNS",
    "GENERATING UNIQUE HASH",
    "CREATING WAVEFORM",
    "PREPARING YOUR EXPERIENCE",
  ];

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoaded(true);
            setTimeout(() => {
              navigate("/home");
            }, 1000);
          }, 500);
          return 100;
        }
        return prev + 1;
      });

      // Change loading text at certain intervals
      if (loadingProgress < 20) {
        setLoadingText(loadingPhrases[0]);
      } else if (loadingProgress < 40) {
        setLoadingText(loadingPhrases[1]);
      } else if (loadingProgress < 60) {
        setLoadingText(loadingPhrases[2]);
      } else if (loadingProgress < 80) {
        setLoadingText(loadingPhrases[3]);
      } else {
        setLoadingText(loadingPhrases[4]);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [loadingProgress, navigate, loadingPhrases]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
      {!isLoaded ? (
        <div className="w-full max-w-md px-4">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-xs">{loadingText}</span>
            <span className="text-xs">{loadingProgress}%</span>
          </div>
          <div className="w-full h-[2px] bg-zinc-900">
            <div
              className="h-full bg-[#c49f08] transition-all duration-100 ease-linear"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center opacity-0 animate-fade-in">
          <h1 className="text-xl">WELCOME TO SOUNDPRINT</h1>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
