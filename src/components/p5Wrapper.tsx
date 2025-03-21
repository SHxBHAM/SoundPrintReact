// "use client"

import { useEffect, useRef } from "react"
import p5 from "p5"

const P5Wrapper = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p: p5) => {
      const hash = "22958e79d9a12d55cf15f891d44bccefbac5c0ababcff12dc4337cb666845296" // Unique identifier

      p.setup = () => {
        const container = containerRef.current
        const width = container?.clientWidth || 400
        const height = container?.clientHeight || 400

        p.createCanvas(width, height, p.WEBGL)
        p.pixelDensity(2) // Smoother edges
        p.frameRate(60)

        const seed = Number.parseInt(hash.substring(0, 8), 16)
        p.noiseSeed(seed)
        p.randomSeed(seed)
      }

      p.draw = () => {
        p.background(10)

        // Auto Zoom Effect
        const zoom = 500 + p.sin(p.frameCount * 0.01) * 200 // Smooth in-out zoom
        p.translate(0, 0, -zoom) // Moves the camera in and out

        // Smooth Rotation
        p.rotateX(p.PI / 3)
        p.rotateZ(p.frameCount * 0.01)

        // Dynamic Lighting
        const lx = p.sin(p.frameCount * 0.01) * 300 // Moving left-right
        const ly = p.cos(p.frameCount * 0.02) * 300 // Moving up-down
        const lz = 150 // Fixed height

        p.pointLight(122, 4, 0, lx, ly, lz) // Red light
        p.pointLight(255, 204, 0, -lx, -ly, lz) // Yellow light

        const cols = 40,
          rows = 40
        const size = 15

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const noiseVal = p.noise(x * 0.1, y * 0.1)
            const h = p.map(noiseVal, 0, 1, 10, 150)

            p.push()
            p.translate((x - cols / 2) * size, (y - rows / 2) * size, h)

            const neonColor = p.lerpColor(p.color("#820303"), p.color("#c49f08"), noiseVal)
            p.ambientMaterial(neonColor) // Reacts to lights
            p.stroke(0) // Removes box outlines

            p.box(size, size, h)
            p.pop()
          }
        }
      }

      p.windowResized = () => {
        const container = containerRef.current
        if (container) {
          p.resizeCanvas(container.clientWidth, container.clientHeight)
        }
      }
    }

    // Create a new p5 instance
    const p5Instance = new p5(sketch, containerRef.current)

    // Cleanup function
    return () => {
      p5Instance.remove()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: "400px" }} />
}

export default P5Wrapper

