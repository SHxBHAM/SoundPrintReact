import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/sound2_backend/sound2_backend.did.js";

// Create agent for the current environment
const createAgent = () => {
  return new HttpAgent({
    // host: "http://127.0.0.1:4943",
    host: "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io",
  });
};

// Create actor for the backend canister
export const createBackendActor = () => {
  const agent = createAgent();

  // // In development mode, fetch the root key
  // if (process.env.NODE_ENV !== "production") {
  //   try {
  //     agent.fetchRootKey().catch((err) => {
  //       console.warn("Unable to fetch root key:", err);
  //     });
  //   } catch (e) {
  //     console.warn("Could not fetch root key:", e);
  //   }
  // }

  // Get the canister ID from the auto-generated declarations
  const canisterId = "ewog2-liaaa-aaaad-aalha-cai"; // Fallback ID

  console.log("Using backend canister ID:", canisterId);

  // Create and return actor
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
