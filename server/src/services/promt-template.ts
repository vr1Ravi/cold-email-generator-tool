import { PromptTemplate } from "@langchain/core/prompts";

export const jobExtractionPrompt = PromptTemplate.fromTemplate(`### SCRAPED TEXT FROM WEBSITE:
{page_data}

### INSTRUCTION:
The scraped text is from the career's page of a website.
Your job is to extract the job posting and return them in JSON format containing the following keys: 'role', 'experience', 'skills' and 'description'.
Only return valid JSON (NO PREAMBLE).

### VALID JSON (NO PREAMBLE):
{{
  "jobs": [
    {{
      "role": "Job title",
      "experience": "Required experience",
      "skills": ["skill1", "skill2", "skill3"],
      "description": "Full job description"
    }}
  ]
}}`);