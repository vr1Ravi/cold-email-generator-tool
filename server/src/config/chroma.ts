import { ChromaClient } from "chromadb";

const chroma = new ChromaClient();
export const portfolioCollection = await chroma.createCollection({ name: "chroma-portfolio-store" });
