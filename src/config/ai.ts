import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import INSTRUCTIONS from "../contents/instructions";

dotenv.config();

const config = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const ai = config.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: INSTRUCTIONS,
});

export default ai;
