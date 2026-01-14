// Import the 'express' module
import express from 'express';
import { groq_model } from './services/groq.js';
import { HumanMessage } from '@langchain/core/messages';
import {jobExtractionPrompt} from './services/promt-template.js';
import {scraper} from './services/scrapper.js'; 
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { loadPortfolioCSVToChroma } from './services/portfolioLoader.js';

// Create an Express application
const app = express();

// Set the port number for the server
const port = 3000;
const csvPath = './data/my_portfolio.csv';
await loadPortfolioCSVToChroma(csvPath);

// Define a route for the root path ('/')
app.get('/', async (req, res) => {

const url = 'https://www.google.com/about/careers/applications/jobs/results/90041512997331654-technical-solutions-engineer-databases-english'; // Replace with the desired URL to scrape
const scrapedData = await scraper.scrapeCompanyInfo(url);

// const message = new HumanMessage(`Provide a brief summary for the following content:\nTitle: ${scrapedData.title}\nDescription: ${scrapedData.description}\nContent: ${scrapedData.content}`);
// const response = await groq_model.invoke([message]);
const jobExtractionChain = jobExtractionPrompt.pipe(groq_model).pipe( new JsonOutputParser());
const extractedJobs = await jobExtractionChain.invoke({page_data: scrapedData.content});
const response = extractedJobs;
  res.send(response);
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});