# SocialData MCP Server - Example Usage Guide

This guide provides practical examples of how to use the SocialData MCP server tools effectively.

## Search Examples

### Basic Search
Find recent tweets about AI:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "artificial intelligence OR AI",
    "type": "Latest"
  }
}
```

### Advanced Search with Operators
Find tweets from Elon Musk about SpaceX with at least 1000 likes:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "from:elonmusk SpaceX min_faves:1000",
    "type": "Top"
  }
}
```

### Date-based Search
Find tweets about Bitcoin from the last week:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "bitcoin OR btc since:2024-01-20 until:2024-01-27",
    "type": "Latest"
  }
}
```

### Excluding Retweets and Replies
Find original tweets only:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "from:naval -filter:replies -filter:nativeretweets",
    "type": "Latest"
  }
}
```

## User Profile Examples

### Get User by Username
```json
{
  "tool": "get_user_profile",
  "arguments": {
    "username": "paulg"
  }
}
```

### Get User by ID
```json
{
  "tool": "get_user_profile",
  "arguments": {
    "user_id": "183749519"
  }
}
```

## Timeline Examples

### Get User's Tweets (excluding replies)
```json
{
  "tool": "get_user_tweets",
  "arguments": {
    "user_id": "44196397",
    "include_replies": false
  }
}
```

### Get User's Tweets and Replies
```json
{
  "tool": "get_user_tweets",
  "arguments": {
    "user_id": "44196397",
    "include_replies": true
  }
}
```

## Tweet Interaction Examples

### Get Tweet Details
```json
{
  "tool": "get_tweet",
  "arguments": {
    "tweet_id": "1890269299287441612"
  }
}
```

### Get Tweet Comments
```json
{
  "tool": "get_tweet_comments",
  "arguments": {
    "tweet_id": "1890269299287441612"
  }
}
```

### Get Quote Tweets
```json
{
  "tool": "get_tweet_quotes",
  "arguments": {
    "tweet_id": "1890269299287441612"
  }
}
```

### Get Full Thread
```json
{
  "tool": "get_thread",
  "arguments": {
    "thread_id": "1549281861687451648"
  }
}
```

## Social Graph Examples

### Get User's Followers
```json
{
  "tool": "get_user_followers",
  "arguments": {
    "user_id": "44196397"
  }
}
```

### Get Who a User Follows
```json
{
  "tool": "get_user_following",
  "arguments": {
    "user_id": "44196397"
  }
}
```

### Verify Following Relationship
Check if @jack follows @elonmusk:
```json
{
  "tool": "verify_user_following",
  "arguments": {
    "source_user_id": "12",
    "target_user_id": "44196397"
  }
}
```

## Mentions and Interactions

### Get User Mentions
Find all tweets mentioning a user:
```json
{
  "tool": "get_user_mentions",
  "arguments": {
    "username": "openai"
  }
}
```

## Pagination Examples

All tools that return multiple items support pagination using cursors:

### First Page
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "from:sama",
    "type": "Latest"
  }
}
```

### Next Page (using cursor from previous response)
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "from:sama",
    "type": "Latest",
    "cursor": "DAACCgACGC12FhmAJxAKAAMYLXYWGX..."
  }
}
```

## Complex Search Queries

### Find Viral Tweets with Media
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "filter:media min_retweets:1000 min_faves:5000 -filter:replies",
    "type": "Top"
  }
}
```

### Find Tweets with Specific Hashtags from Verified Users
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "#AI OR #MachineLearning filter:blue_verified",
    "type": "Latest"
  }
}
```

### Geographic Search
Find tweets near San Francisco:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "near:\"San Francisco\" within:10km",
    "type": "Latest"
  }
}
```

### Find Conversations
Find all replies in a conversation:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "conversation_id:1890269299287441612",
    "type": "Latest"
  }
}
```

## Working with Large Datasets

When retrieving large amounts of data, use the cursor pagination and combine with search operators:

### Retrieve Historical Tweets
Use `max_id` and `since_id` operators:
```json
{
  "tool": "search_tweets",
  "arguments": {
    "query": "from:elonmusk since_id:1800000000000000000 max_id:1850000000000000000",
    "type": "Latest"
  }
}
```

## Error Handling

The server will return error messages in this format:
```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "Error: API request failed: 404 - User not found"
    }
  ]
}
```

Common errors:
- 401: Invalid API key
- 402: Insufficient credits
- 404: User/Tweet not found
- 422: Invalid parameters
- 429: Rate limit exceeded

## Best Practices

1. **Use specific search operators** to reduce API calls and get more relevant results
2. **Cache user IDs** when you look up users by username to avoid repeated lookups
3. **Handle pagination** properly for large result sets
4. **Check rate limits** - default is 120 requests/minute
5. **Use appropriate search types** - "Latest" for real-time, "Top" for popular content
6. **Combine operators** for powerful queries (e.g., `from:user min_faves:100 -filter:replies`)

## Cost Optimization

Since the API charges $0.0002 per item:
- Use search operators to filter results
- Request only the data you need
- Use cursors efficiently for pagination
- Cache results when appropriate