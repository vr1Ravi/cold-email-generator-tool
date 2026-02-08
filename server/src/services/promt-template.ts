import { PromptTemplate } from "@langchain/core/prompts";

export const jobExtractionPrompt =
  PromptTemplate.fromTemplate(`### SCRAPED TEXT FROM WEBSITE:
{page_data}

### INSTRUCTION:
The scraped text is from the career's page of a website.
Your job is to extract the job posting and return them in JSON format containing the following keys: 'role', 'experience', 'skills' and 'description'.
Only return valid JSON (NO PREAMBLE).

### VALID JSON (NO PREAMBLE):
{{
      "role": "Job title",
      "experience": "Required experience",
      "skills": ["skill1", "skill2", "skill3"],
      "description": "Full job description"
    }}`);

export const emailPrompt = PromptTemplate.fromTemplate(`
    ### JOB DESCRIPTION:
   {job_description}

    ### INSTRUCTION:
    You are Ravi, an SDE-1 at Wobot AI.
    Wobot AI builds AI-powered video analytics solutions that help enterprises improve security, operations, and decision-making.
    You work closely on building scalable frontend, backend and mobile applications using modern technologies.

    ### INSTRUCTION:
    Your task is to write a cold email to the recipient regarding the job description mentioned above.
    The email should:
    - Clearly express interest in the role/company
    - Briefly highlight relevant technical experience and impact
    - Sound confident, concise, and genuine
    - Be tailored to the role, not generic
    - Avoid buzzwords and unnecessary fluff

    Also add the most relevent ones from the following links to showcase portfolio: {link_list}

    Do NOT add assumptions beyond the given job description.
    Do NOT include explanations or analysis.

    ### TONE:
    Professional, enthusiastic, and to-the-point.

    ### EMAIL (NO PREAMBLE):
    `);
