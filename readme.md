# SocialData MCP Server

A Model Context Protocol (MCP) server that provides access to the SocialData API, enabling LLMs to interact with Twitter/X data.

## Features

This MCP server exposes the following tools:

- **search_tweets** - Search for tweets using Twitter's advanced search operators
- **get_user_profile** - Get detailed information about a Twitter user
- **get_user_tweets** - Get recent tweets from a user's timeline
- **get_tweet** - Get detailed information about a specific tweet
- **get_tweet_comments** - Get comments/replies to a specific tweet
- **get_tweet_quotes** - Get quote tweets for a specific tweet
- **get_user_followers** - Get a list of users who follow the specified user
- **get_user_following** - Get a list of users that the specified user follows
- **get_user_mentions** - Get tweets mentioning a specific user
- **get_thread** - Get all tweets in a conversation thread
- **verify_user_following** - Check if one user is following another user

## Prerequisites

- Node.js 18+ 
- A SocialData API key (get one at [https://socialdata.tools](https://socialdata.tools))

## Quick Setup

1. Clone or download this repository
2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

Or manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Configuration

Set your SocialData API key as an environment variable:

```bash
export SOCIALDATA_API_KEY=your_api_key_here
```

## Testing

Run the test suite to verify your setup:

```bash
npm test
```

This will test the connection, API key, and basic functionality.

## Usage

### With Claude Desktop

1. Run the configuration helper:
   ```bash
   npm run configure
   ```

2. Or manually add to your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "socialdata": {
      "command": "node",
      "args": ["/path/to/socialdata-mcp-server/dist/index.js"],
      "env": {
        "SOCIALDATA_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

3. Restart Claude Desktop

### With Other MCP Clients

Run the server using stdio transport:

```bash
SOCIALDATA_API_KEY=your_api_key_here npm start
```

## Example Tool Usage

### Search Tweets
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "from:elonmusk AI",
    "type": "Latest"
  }
}
```

### Get User Profile
```json
{
  "tool": "get_user_profile",
  "arguments": {
    "username": "elonmusk"
  }
}
```

### Get Tweet Details
```json
{
  "tool": "get_tweet",
  "arguments": {
    "tweet_id": "1234567890123456789"
  }
}
```

## Twitter Search Operators

The `search_tweets` tool supports all Twitter advanced search operators:

- `from:username` - Tweets from a specific user
- `to:username` - Replies to a specific user
- `@username` - Mentions of a user
- `#hashtag` - Tweets with a hashtag
- `since:2024-01-01` - Tweets since a date
- `until:2024-12-31` - Tweets until a date
- `filter:media` - Tweets with media
- `filter:links` - Tweets with links
- `min_faves:100` - Minimum number of likes
- `min_retweets:50` - Minimum number of retweets
- And many more...

## API Pricing

The SocialData API uses usage-based pricing:
- Most endpoints: $0.0002 per item retrieved
- Special endpoints have different pricing (see SocialData documentation)

## Error Handling

The server handles common API errors:
- 401: Invalid API key
- 402: Insufficient credits
- 404: Resource not found
- 422: Validation error
- 429: Rate limit exceeded
- 500: Server error

## Rate Limits

- Default: 120 requests per minute
- Higher limits available for high-volume users

## Development

For development with hot reloading:

```bash
SOCIALDATA_API_KEY=your_api_key_here npm run dev
```

## TypeScript Configuration

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Project Structure

```
socialdata-mcp-server/
├── src/
│   └── index.ts          # Main server implementation
├── test/
│   └── test.ts          # Test suite
├── dist/                # Compiled JavaScript (generated)
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
├── setup.sh            # Setup script
├── README.md           # This file
└── examples.md         # Detailed usage examples
```

## License

MIT