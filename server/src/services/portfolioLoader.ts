import fs from "fs/promises";
import { portfolioCollection } from "../config/chroma.js";

interface Portfolio {
  techStack: string;
  links: string;
}

/**
 * Parse CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Load portfolio CSV to Chroma DB
 * CSV format: Techstack, Links
 */
export async function loadPortfolioCSVToChroma(csvFilePath: string): Promise<void> {
  try {
    const fileContent = await fs.readFile(csvFilePath, "utf-8");
    const lines = fileContent.trim().split("\n");

    // Skip header row
    const dataLines = lines.slice(1).filter((line) => line.trim().length > 0);

    const ids: string[] = [];
    const documents: string[] = [];
    const metadatas: {link: string}[] = [];

    dataLines.forEach((line, index) => {
      const fields = parseCSVLine(line);

      if (fields.length >= 2) {
        const techStack = fields[0]!.replace(/^"|"$/g, "").trim();
        const link = fields[1]!.replace(/^"|"$/g, "").trim();

        if (techStack && link) {
          ids.push(`portfolio_${index}`);
          documents.push(techStack); // For similarity search
          metadatas.push({link});
        }
      }
    });

    if (ids.length > 0) {
      // Add to Chroma
      await portfolioCollection.add({
        ids,
        documents,
        metadatas,
      });

      console.log(`✅ Loaded ${ids.length} portfolio items to Chroma DB`);
    } else {
      console.warn("⚠️ No valid portfolio items found in CSV");
    }
  } catch (error) {
    console.error("❌ Error loading portfolio CSV to Chroma:", error);
    throw error;
  }
}

// /**
//  * Search portfolio by tech stack similarity
//  */
// export async function searchPortfolioByTechStack(
//   query: string,
//   nResults: number = 5
// ): Promise<{
//   ids: string[];
//   documents: string[][];
//   metadatas: Portfolio[][];
//   distances: number[][];
// }> {
//   const results = await portfolioCollection.query({
//     queryTexts: [query],
//     nResults,
//   });

//   return results;
// }

// /**
//  * Get all portfolio items
//  */
// export async function getAllPortfolioItems(): Promise<{
//   ids: string[];
//   documents: string[];
//   metadatas: Portfolio[];
// }> {
//   const results = await portfolioCollection.get();
//   return results;
// }