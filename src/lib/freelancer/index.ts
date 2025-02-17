import axios, { AxiosError, AxiosInstance } from "axios";
import tryCatchAsync from "../try-catch-async";
import Logger from "../logger";
import fs from "fs";
import {
  Project,
  ProjectFromFreelancer,
  ResponseFromAI,
  SearchForActiveProjectsParams,
} from "./types";
import ai from "../../config/ai";
import aiResponseValidator from "../../validator/ai-respones";

class Freelancer {
  token: string;
  baseUrl: string;
  api: AxiosInstance;
  logger: Logger;
  constructor() {
    this.token = process.env.FREELANCER_ACCESS_TOKEN || "";
    this.baseUrl = "https://www.freelancer.com/api/projects/0.1";
    this.logger = new Logger("Freelancer");
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async searchForActiveProjects({
    page = 1,
    query,
    limit = 10,
  }: SearchForActiveProjectsParams): Promise<Project[]> {
    const [err, res] = await tryCatchAsync<Error, ProjectFromFreelancer[]>(
      async () => {
        const response = await this.api.get<{
          result: { projects: ProjectFromFreelancer[] };
        }>("/projects/active/", {
          params: {
            query,
            offset: (page - 1) * limit,
            limit,
            full_description: true,
            job_details: true,
            user_details: true,
            user_balance_details: true,
            user_financial_details: true,
            user_status: true,
            user_reputation: true,
          },
        });

        return (
          response.data?.result?.projects?.filter(
            (project) => project.status === "active" && !project.deleted
          ) || []
        );
      }
    );

    if (err) {
      this.logger.error("Unable to search for active projects", err);
      return [];
    }

    return res.map(
      (project): Project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        bidStats: {
          bidAvg: project.bid_stats.bid_avg,
          bidCount: project.bid_stats.bid_count,
        },
        budget: {
          maximum: project.budget.maximum,
          minimum: project.budget.minimum,
          durationType:
            project.budget.project_type === "fixed" ? "fixed" : "periodic",
        },
        currency: project.currency.code,
        periodicInfo: project.hourly_project_info?.commitment
          ? `${project.hourly_project_info.commitment.hours} hours /  ${project.hourly_project_info.commitment.interval}`
          : undefined,
      })
    );
  }

  async createProposal(project: Project): Promise<ResponseFromAI | null> {
    const prompt = this.generateProposalPrompt(project);
    const result = await ai.generateContent(prompt);

    this.logger.log(
      "AI response for project",
      project.id,
      result.response.text()
    );

    let response: ResponseFromAI | null = null;

    try {
      response = aiResponseValidator(result.response.text());
    } catch (err) {
      this.logger.error("Unable to validate AI response", err);
      return null;
    }

    if (response?.ignore) {
      this.logger.log("Ignoring project", project.id);
      return null;
    }

    return response;
  }

  private generateProposalPrompt(project: Project) {
    return `Title: ${project.title}
Description: ${project.description}
Budget: Maximum ${project.budget.maximum}, Minimum ${
      project.budget.minimum
    }, Average ${project.bidStats.bidAvg}
Currency: ${project.currency}
Duration Type: ${project.budget.durationType}
Periodic Info: ${project.periodicInfo ? project.periodicInfo : "Not specified"}
`;
  }

  async bidOnProject(project: Project) {
    const proposal = await this.createProposal(project);

    if (!proposal) {
      this.logger.error("Unable to create proposal", project.id);
      return;
    }

    this.logger.log(
      "Creating bid for project",
      project.id,
      project.description
    );

    const [err] = await tryCatchAsync<AxiosError, void>(async () => {
      await this.api.post(`/bids/`, {
        project_id: project.id,
        amount: proposal.amount,
        period:
          project.budget.durationType === "fixed" ? proposal.duration : 40,
        milestone_percentage: 100,
        description: proposal.proposal,
        bidder_id: Number(process.env.FREELANCER_ACCOUNT_ID),
      });
    });

    if (err) {
      this.logger.error(
        "Unable to bid on project",
        project.id,
        err.response?.data
      );
      return;
    }

    this.logger.log("Bid on project successfully", project.id);
  }
}

export default Freelancer;
