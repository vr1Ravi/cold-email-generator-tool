import { ChatGroq } from "@langchain/groq";
import env from "../config/env.js"

export const groq_model = new ChatGroq({
  apiKey: env.GROQ_API_KEY, 
  model: "llama-3.3-70b-versatile",
});

