import { CloudClient } from 'chromadb';
import dotenv from 'dotenv';

dotenv.config();

const client = new CloudClient();

const portfolioCollection = await client.getOrCreateCollection({
name: "chroma-portfolio-store"
});

export { portfolioCollection };

