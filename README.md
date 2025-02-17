# Freelance Bot

## Overview
This project is a bot designed to generate bid proposals for freelancer projects using AI (gemini api). It automates the process of searching for active projects and bidding on them based on predefined instructions.

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- PNPM (Package Manager)
- PM2 (Process Manager)
- Freelancer Access Token (https://accounts.freelancer.com/settings/developers)
- Gemini API Key (https://aistudio.google.com/apikey)

### Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/jrTilak/freelance-bot.git
   cd freelance-bot
   ```

2. **Install PNPM**
   If you haven't installed PNPM yet, you can do so globally using npm:
   ```bash
   npm install -g pnpm
   ```

3. **Install Dependencies**
   Use PNPM to install the project dependencies:
   ```bash
   pnpm install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory of the project and add the following variables:
   ```env
   FREELANCER_ACCESS_TOKEN=<your_freelancer_access_token>
   GEMINI_API_KEY=<your_gemini_api_key>
   PROJECT_LIMIT_ON_EACH_REQUEST=10
   BID_INTERVAL_IN_MINUTES=30
   ```

5. **Build the Project**
   Compile the TypeScript files to JavaScript:
   ```bash
   pnpm build
   ```

### Running the Application

1. **Install PM2**
   If you haven't installed PM2 yet, you can do so globally using npm:
   ```bash
   npm install -g pm2
   ```

2. **Start the Application with PM2**
   Use PM2 to run the application:
   ```bash
   pm2 start dist/index.js --name "freelance-bot"
   ```

3. **Managing the Application**
   - To view the logs:
     ```bash
     pm2 logs freelance-bot
     ```
   - To stop the application:
     ```bash
     pm2 stop freelance-bot
     ```
   - To restart the application:
     ```bash
     pm2 restart freelance-bot
     ```

4. **Save the Application**
   Save the application to the PM2 ecosystem file so that it can be started automatically on system restart:
   ```bash
   pm2 save 
   ```

### Additional Information
- Ensure that your environment variables are correctly set up before running the application.
- The bot will automatically search for active projects and bid on them based on the defined instructions in the `src/contents/instructions.ts` file.
- Please edit the instructions in the `src/contents/instructions.ts` file to match your skills and projects.
