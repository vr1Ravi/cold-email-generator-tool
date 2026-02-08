import type { Request, Response } from "express";
import { scraper } from "../services/scrapper.js";
import {
  emailPrompt,
  jobExtractionPrompt,
} from "../services/promt-template.js";
import { groq_model } from "../services/groq.js";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import type { Job } from "../types/index.js";
import { portfolioCollection } from "../config/chroma.js";

interface JobPostRequest extends Request {
  body: {
    job_link: string;
  };
}

export const handleJobPost = async (req: JobPostRequest, res: Response) => {
  const job_link = req.body.job_link;
  const scrapedData = await scraper.scrapeCompanyInfo(job_link);

  const jobExtractionChain = jobExtractionPrompt
    .pipe(groq_model)
    .pipe(new JsonOutputParser());

  const extractedJob: Job = await jobExtractionChain.invoke({
    page_data: scrapedData.content,
  });

  const skillsQuery = extractedJob.skills.join(", ");
  const portfolio = await portfolioCollection.query({
    queryTexts: [skillsQuery],
    nResults: 3,
  });
  const project_links = portfolio.metadatas[0]!.map((meta) => meta!.link);
  const coldEmailChain = emailPrompt.pipe(groq_model);
  const coldEmail = await coldEmailChain.invoke({
    job_description: scrapedData,
    link_list: project_links,
  });
  console.log({ coldEmail: coldEmail.content });

  res.json({
    email: coldEmail.content,
  });
};
const DOM = {};
