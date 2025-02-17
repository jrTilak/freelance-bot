import fs from "fs";
import path from "path";

class Logger {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  log = (...messages: any[]) => {
    this.writeLog("INFO", messages);
  };

  error = (...messages: any[]) => {
    this.writeLog("ERROR", messages);
  };

  private writeLog = (level: string, ...messages: any[]) => {
    const logFilePath = path.join(
      ".tmp",
      "logs",
      `${new Date().toISOString().split("T")[0]}.txt`
    );
    const logMessage = {
      logger: this.name,
      level,
      message: this.formatMessage(messages),
    };
    console.log(`[${this.name}] ${logMessage.message}`);
    this.ensureLogDirectoryExists(logFilePath);
    fs.appendFileSync(logFilePath, `${JSON.stringify(logMessage)}\n`);
  };

  private formatMessage = (messages: any[]) => {
    return messages.map((message) =>
      typeof message === "object" || Array.isArray(message)
        ? JSON.stringify(message)
        : String(message)
    );
  };

  private ensureLogDirectoryExists = (filePath: string) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };
}

export default Logger;

export const logger = new Logger("Global");
