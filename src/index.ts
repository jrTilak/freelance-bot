import dotenv from "dotenv";
import Freelancer from "./lib/freelancer";

dotenv.config();

const freelancer = new Freelancer();

const queries = [
  "javascript",
  "react",
  "nodejs",
  "nextjs",
  "typescript",
  "website",
  "development",
  "react native",
  "app",
  "ecommerce",
  "express",
  "mongodb",
  "backend",
  "frontend",
  "fullstack",
  "api",
  "database",
  "docker",
];

(async () => {
  const interval = Number(process.env.BID_INTERVAL_IN_MINUTES || 30);

  let iteration = 1;

  const fn = async () => {
    console.log(`Iteration ${iteration}`);
    const projects = await freelancer.searchForActiveProjects({
      limit: Number(process.env.PROJECT_LIMIT_ON_EACH_REQUEST || 10),
      page: 1,
      query: queries.join(","),
    });

    for (const project of projects) {
      /**
       * rate limit for gemini api is
       * Model                RPM	 TPM	      RPD
       * Gemini 2.0 Flash	    15	 1,000,000	1,500
       * https://ai.google.dev/gemini-api/docs/rate-limits?hl=en
       *
       * so we need to sleep for 30 seconds to avoid rate limiting
       */

      await new Promise((resolve) => setTimeout(resolve, 30000));
      await freelancer.bidOnProject(project);
    }

    iteration++;
  };

  // Run the function once immediately
  await fn();

  // Run the function every interval minutes
  setInterval(fn, interval * 60 * 1000);
})();
