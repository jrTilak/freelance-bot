import { ResponseFromAI } from "../lib/freelancer/types";
import { logger } from "../lib/logger";

const aiResponseValidator = (response: string): ResponseFromAI | null => {
  console.log(response);

  try {
    let json: ResponseFromAI | null = null;

    if (response.startsWith("{") && response.endsWith("}")) {
      json = JSON.parse(response.trim());
    } else if (response.startsWith("```json") && response.endsWith("```")) {
      json = JSON.parse(response.slice(7, -3).trim());
    }

    if (!json) {
      logger.error("Unable to parse AI response", response);
      return null;
    }

    if (json.ignore) {
      return null;
    }

    if (!["proposal", "amount", "duration"].every((key) => key in json)) {
      logger.error("Invalid AI response", response);
      return null;
    }

    if (typeof json.proposal !== "string") {
      logger.error("Invalid AI response", response);
      return null;
    }

    if (typeof json.amount !== "number") {
      // extract amount from proposal using regex
      const amount = json.proposal.match(/(\d+\.\d+|\d+)/);
      if (!amount) {
        logger.error("Invalid AI response", response);
        return null;
      }
      json.amount = parseInt(amount[0]);

      if (isNaN(json.amount)) {
        logger.error("Invalid AI response", response);
        return null;
      }
    }

    if (typeof json.duration !== "number") {
      // extract duration from proposal using regex
      const duration = json.proposal.match(/(\d+\.\d+|\d+)/);
      if (!duration) {
        logger.error("Invalid AI response", response);
        return null;
      }
      json.duration = parseInt(duration[0]);
    }

    return json;
  } catch (err) {
    logger.error("Unable to parse AI response", err);
    return null;
  }
};

export default aiResponseValidator;
