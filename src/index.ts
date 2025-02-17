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
    // sleep for 10 seconds to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 10000));

    console.log(`Iteration ${iteration}`);
    const projects = await freelancer.searchForActiveProjects({
      limit: Number(process.env.PROJECT_LIMIT_ON_EACH_REQUEST || 10),
      page: 1,
      query: queries.join(","),
    });

    for (const project of projects) {
      await freelancer.bidOnProject(project);
    }

    iteration++;
  };

  // Run the function once immediately
  await fn();

  // Run the function every interval minutes
  setInterval(fn, interval * 60 * 1000);
})();
