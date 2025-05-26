import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configuration
const SOCIALDATA_API_KEY = process.env.SOCIALDATA_API_KEY;
const SOCIALDATA_BASE_URL = "https://api.socialdata.tools";

if (!SOCIALDATA_API_KEY) {
  console.error("Error: SOCIALDATA_API_KEY environment variable is required");
  process.exit(1);
}

// Helper function to make API requests
async function makeApiRequest(endpoint: string, options: any = {}) {
  const url = `${SOCIALDATA_BASE_URL}${endpoint}`;
  const headers = {
    "Authorization": `Bearer ${SOCIALDATA_API_KEY}`,
    "Accept": "application/json",
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`API request error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Define available tools
const TOOLS: Tool[] = [
  {
    name: "search_tweets",
    description: "Search for tweets using Twitter's advanced search operators",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query with Twitter operators (e.g., 'from:elonmusk', '#AI', 'machine learning since:2024-01-01')"
        },
        type: {
          type: "string",
          enum: ["Latest", "Top"],
          description: "Search type - Latest for recent tweets or Top for popular tweets",
          default: "Latest"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "get_user_profile",
    description: "Get detailed information about a Twitter user",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "Twitter username without @ symbol"
        },
        user_id: {
          type: "string",
          description: "Twitter user ID (numeric)"
        }
      }
    }
  },
  {
    name: "get_user_tweets",
    description: "Get recent tweets from a user's timeline",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "Twitter user ID (numeric)"
        },
        include_replies: {
          type: "boolean",
          description: "Include replies in the results",
          default: false
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "get_tweet",
    description: "Get detailed information about a specific tweet",
    inputSchema: {
      type: "object",
      properties: {
        tweet_id: {
          type: "string",
          description: "Tweet ID"
        }
      },
      required: ["tweet_id"]
    }
  },
  {
    name: "get_tweet_comments",
    description: "Get comments/replies to a specific tweet",
    inputSchema: {
      type: "object",
      properties: {
        tweet_id: {
          type: "string",
          description: "Tweet ID"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["tweet_id"]
    }
  },
  {
    name: "get_user_followers",
    description: "Get a list of users who follow the specified user",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "Twitter user ID (numeric)"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "get_user_following",
    description: "Get a list of users that the specified user follows",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "Twitter user ID (numeric)"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["user_id"]
    }
  },
  {
    name: "verify_user_following",
    description: "Check if one user is following another user",
    inputSchema: {
      type: "object",
      properties: {
        source_user_id: {
          type: "string",
          description: "ID of the follower user"
        },
        target_user_id: {
          type: "string",
          description: "ID of the user being followed"
        }
      },
      required: ["source_user_id", "target_user_id"]
    }
  },
  {
    name: "get_tweet_quotes",
    description: "Get quote tweets for a specific tweet",
    inputSchema: {
      type: "object",
      properties: {
        tweet_id: {
          type: "string",
          description: "Tweet ID"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["tweet_id"]
    }
  },
  {
    name: "get_user_mentions",
    description: "Get tweets mentioning a specific user",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "Twitter username without @ symbol"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["username"]
    }
  },
  {
    name: "get_thread",
    description: "Get all tweets in a conversation thread",
    inputSchema: {
      type: "object",
      properties: {
        thread_id: {
          type: "string",
          description: "Thread ID (usually the first tweet ID in the thread)"
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination (optional)"
        }
      },
      required: ["thread_id"]
    }
  }
];

// Initialize MCP server
const server = new Server({
  name: "socialdata-api",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Handle tool list requests
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (!args) {
    throw new Error('Arguments are required');
  }

  try {
    switch (name) {
      case "search_tweets": {
        const queryParams = new URLSearchParams();
        queryParams.append('query', String(args.query));
        if (args.type) queryParams.append('type', String(args.type));
        if (args.cursor) queryParams.append('cursor', String(args.cursor));
        
        const result = await makeApiRequest(`/twitter/search?${queryParams}`);
        
        // Optimize response to reduce token usage
        if ((result as any).tweets && Array.isArray((result as any).tweets)) {
          (result as any).tweets = (result as any).tweets.map((tweet: any) => ({
            ...tweet,
            user: tweet.user ? {
              screen_name: tweet.user.screen_name,
              name: tweet.user.name,
              verified: tweet.user.verified
            } : null
          }));
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_user_profile": {
        let endpoint: string;
        if ('username' in args && args.username) {
          endpoint = `/twitter/user/${args.username}`;
        } else if ('user_id' in args && args.user_id) {
          endpoint = `/twitter/user/${args.user_id}`;
        } else {
          throw new Error("Either username or user_id must be provided");
        }
        
        const result = await makeApiRequest(endpoint);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_user_tweets": {
        const endpoint = ('include_replies' in args && args.include_replies) 
          ? `/twitter/user/${args.user_id}/tweets-and-replies`
          : `/twitter/user/${args.user_id}/tweets`;
        
        const queryParams = ('cursor' in args && args.cursor) ? `?cursor=${args.cursor}` : "";
        const result = await makeApiRequest(`${endpoint}${queryParams}`);
        
        // Optimize response to reduce token usage
        if ((result as any).tweets && Array.isArray((result as any).tweets)) {
          (result as any).tweets = (result as any).tweets.map((tweet: any) => ({
            ...tweet,
            user: tweet.user ? {
              screen_name: tweet.user.screen_name,
              name: tweet.user.name,
              verified: tweet.user.verified
            } : null
          }));
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_tweet": {
        const result = await makeApiRequest(`/twitter/tweets/${args.tweet_id}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_tweet_comments": {
        const queryParams = ('cursor' in args && args.cursor) ? `?cursor=${args.cursor}` : "";
        const result = await makeApiRequest(`/twitter/tweets/${args.tweet_id}/comments${queryParams}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_user_followers": {
        const queryParams = new URLSearchParams();
        queryParams.append('user_id', String(args.user_id));
        if ('cursor' in args && args.cursor) queryParams.append('cursor', String(args.cursor));
        
        const result = await makeApiRequest(`/twitter/followers/list?${queryParams}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_user_following": {
        const queryParams = new URLSearchParams();
        queryParams.append('user_id', String(args.user_id));
        if ('cursor' in args && args.cursor) queryParams.append('cursor', String(args.cursor));
        
        const result = await makeApiRequest(`/twitter/friends/list?${queryParams}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "verify_user_following": {
        const result = await makeApiRequest(
          `/twitter/user/${args.source_user_id}/following/${args.target_user_id}`
        );
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_tweet_quotes": {
        const queryParams = ('cursor' in args && args.cursor) ? `?cursor=${args.cursor}` : "";
        const result = await makeApiRequest(`/twitter/tweets/${args.tweet_id}/quotes${queryParams}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_user_mentions": {
        const queryParams = ('cursor' in args && args.cursor) ? `?cursor=${args.cursor}` : "";
        const result = await makeApiRequest(`/twitter/user/${args.username}/mentions${queryParams}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case "get_thread": {
        const queryParams = ('cursor' in args && args.cursor) ? `?cursor=${args.cursor}` : "";
        const result = await makeApiRequest(`/twitter/thread/${args.thread_id}${queryParams}`);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ]
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SocialData MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});