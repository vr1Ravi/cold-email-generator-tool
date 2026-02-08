export interface Job {
  role: string;
  experience: string;
  skills: string[];
  description: string;
}

export interface ExtractedJobs {
  jobs: Job[];
}