# LinkedIn Engagement Scraper

A TypeScript-based tool that analyzes LinkedIn profile engagement data using Apify's LinkedIn Engagement Scraper actor. This tool helps you understand how a LinkedIn profile engages with content by analyzing their recent interactions, including likes, reactions, and comments.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- An Apify account and API token

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd linkedin-engagement-scrapper
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Apify API token:

```bash
APIFY_API_KEY=your_apify_api_token_here
```

You can get your Apify API token by:

1. Creating an account at [Apify](https://apify.com)
2. Going to your account settings
3. Finding your API token in the "Integrations" section

## Usage

Run the script by providing a LinkedIn profile URL as an argument:

```bash
npm run start "https://www.linkedin.com/in/target-profile/"
```

The script will:

1. Fetch recent engagement data for the specified profile
2. Transform and analyze the data
3. Generate insights about engagement patterns
4. Save a detailed report in the `data` directory
5. Display the results in the console

## Output

The script generates a JSON report containing:

- Profile URL analyzed
- Timestamp of analysis
- Recent engagements (likes, reactions, comments)
- Engagement insights including:
  - Total number of engagements
  - Distribution of engagement types
  - Top authors engaged with
  - Most common topics in engaged content

The report is saved in the `data` directory with a timestamp in the filename.

## Notes

- The script uses Apify's LinkedIn Engagement Scraper actor to fetch data
- It processes the last 10 engagements by default
- The script validates all data using Zod schemas
- Results are saved in both console output and a JSON file
- Make sure the LinkedIn profile URL is public and accessible

## Error Handling

The script includes validation for:

- LinkedIn profile URL format
- Required environment variables
- Data structure and types
- API responses

If any errors occur, they will be logged to the console with detailed information about the issue.

## Further Details & Design Approach

For a detailed explanation of the architectural choices, tools used, and the rationale behind the design of this scraper, please refer to the [APPROACH.md](APPROACH.md) file in this repository.

## License

ISC License
