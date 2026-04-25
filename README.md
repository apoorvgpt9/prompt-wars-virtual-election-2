# ElectEd — Indian Election Education

ElectEd is a specialized educational tool designed to help citizens understand the intricacies of the Indian election process. By leveraging AI-driven agents, it provides a structured learning path, real-time analysis of election topics, and interactive scenario-based evaluations, all while adhering to strict governance and accuracy standards.

The application focuses on ECI-accurate facts and provides a non-partisan, accessible experience for users to explore everything from the Model Code of Conduct to the counting of votes.

## Live URL
[Live Deployment URL](https://elected-education.a-south1.run.app) *(Placeholder)*

## Architecture Overview
ElectEd follows a **3-agent pattern** to ensure high-quality, structured educational output:
1.  **Analyst Agent**: Decomposes the user's chosen topic into key dimensions (e.g., historical context, constitutional basis).
2.  **Builder Agent**: Transforms the analysis into structured educational modules and a visual timeline of 6–8 items.
3.  **Evaluator Agent**: Provides feedback on user interactions and scenarios, ensuring learning objectives are met.

All interactions pass through a strict **Governance Layer** that validates both inputs and outputs against security and domain rules.

## Local Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/apoorvgpt9/elected.git
    cd elected
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env.local` file in the root directory:
    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for agent intelligence | Yes |

## Running Tests
The project uses Vitest for unit testing. AI calls are mocked to ensure deterministic results.
```bash
npm test
```

## Deployment
ElectEd is designed for deployment on **Google Cloud Run**.
[Deployment Guide/Link](https://console.cloud.google.com/run)
