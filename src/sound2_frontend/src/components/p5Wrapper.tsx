import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import p5 from "p5";
import { getTopGenres } from "../services/spotify";

export interface P5WrapperHandle {
  downloadCanvas: () => void;
}

const P5Wrapper = forwardRef<P5WrapperHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hash, setHash] = useState<string>(
    "22958e79d9a12d55cf15f891d44bccefbac5c0ababcff12dc4337cb666845296"
  );
  const p5InstanceRef = useRef<p5 | null>(null);

  useImperativeHandle(ref, () => ({
    downloadCanvas: () => {
      if (p5InstanceRef.current) {
        const timestamp = new Date().toISOString().split("T")[0];
        p5InstanceRef.current.save(`soundprint-${timestamp}.png`);
      }
    },
  }));

  useEffect(() => {
    const fetchHash = async () => {
      try {
        const genreData = await getTopGenres(10);
        if (typeof genreData !== "string" && genreData.hash) {
          setHash(genreData.hash);
        }
      } catch (error) {
        console.error("Error fetching hash:", error);
      }
    };
    fetchHash();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      p.setup = () => {
        const container = containerRef.current;
        const width = container?.clientWidth || 400;
        const height = container?.clientHeight || 400;

        p.createCanvas(width, height, p.WEBGL);
        p.pixelDensity(2);
        p.frameRate(60);
        p.smooth();

        const seed = Number.parseInt(hash.substring(0, 8), 16);
        p.noiseSeed(seed);
        p.randomSeed(seed);
      };

      p.draw = () => {
        p.background(0); // Pure black background
        p.ambientLight(20); // Subtle ambient light

        // Smoother camera movement
        const zoom = 600 + p.sin(p.frameCount * 0.005) * 100;
        p.translate(0, 0, -zoom);

        // More dynamic rotation
        p.rotateX(p.PI / 2.5);
        p.rotateZ(p.frameCount * 0.005);

        // Enhanced lighting
        const t = p.frameCount * 0.01;
        const radius = 400;
        const lx1 = p.cos(t) * radius;
        const ly1 = p.sin(t) * radius;
        const lx2 = p.cos(t + p.PI) * radius;
        const ly2 = p.sin(t + p.PI) * radius;

        // Warmer color palette
        p.pointLight(255, 147, 0, lx1, ly1, 200); // Orange light
        p.pointLight(255, 0, 0, lx2, ly2, 200); // Red light
        p.pointLight(255, 204, 0, 0, 0, -200); // Yellow backlight

        const cols = 50; // Increased resolution
        const rows = 50;
        const size = 12; // Slightly smaller boxes
        const noiseScale = 0.08; // More detailed noise

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const xOff = x * noiseScale;
            const yOff = y * noiseScale + p.frameCount * 0.002; // Subtle movement
            const noiseVal = p.noise(xOff, yOff);
            const h = p.map(noiseVal, 0, 1, 5, 180); // More height variation

            p.push();
            p.translate((x - cols / 2) * size, (y - rows / 2) * size, h / 2);

            // Gradient color based on height
            const baseColor = p.lerpColor(
              p.color(130, 3, 3), // Dark red
              p.color(196, 159, 8), // Gold
              noiseVal
            );

            // Add shimmer effect
            const shimmer = p.sin(p.frameCount * 0.1 + x * 0.1 + y * 0.1) * 30;
            const finalColor = p.color(
              p.red(baseColor) + shimmer,
              p.green(baseColor) + shimmer,
              p.blue(baseColor) + shimmer
            );

            p.ambientMaterial(finalColor);
            p.stroke(0);
            p.strokeWeight(0.5);

            p.box(size * 0.9, size * 0.9, h); // Slightly smaller boxes with height
            p.pop();
          }
        }
      };

      p.windowResized = () => {
        const container = containerRef.current;
        if (container) {
          p.resizeCanvas(container.clientWidth, container.clientHeight);
        }
      };
    };

    // Create a new p5 instance
    const p5Instance = new p5(sketch, containerRef.current);
    p5InstanceRef.current = p5Instance;

    // Cleanup function
    return () => {
      p5Instance.remove();
      p5InstanceRef.current = null;
    };
  }, [hash]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
});

P5Wrapper.displayName = "P5Wrapper";
export default P5Wrapper;
