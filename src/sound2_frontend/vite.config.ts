import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import environment from "vite-plugin-environment";

// Set II_URL based on the DFX_NETWORK environment variable
process.env.II_URL =
  process.env.DFX_NETWORK === "local"
    ? `http://${process.env.CANISTER_ID_INTERNET_IDENTIY}.localhost:4943`
    : `https://identity.ic0.app`;

export default defineConfig({
  plugins: [react(), environment(["II_URL"])],
});
