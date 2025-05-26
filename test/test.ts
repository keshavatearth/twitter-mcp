#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function testServer() {
  console.log("🧪 Testing SocialData MCP Server...\n");

  // Check for API key
  if (!process.env.SOCIALDATA_API_KEY) {
    console.error("❌ Error: SOCIALDATA_API_KEY environment variable is not set");
    process.exit(1);
  }

  try {
    // Start the server
    const serverProcess = spawn("node", ["dist/index.js"], {
      env: { ...process.env },
      stdio: ["pipe", "pipe", "pipe"]
    });

    // Create client
    const transport = new StdioClientTransport({
      command: "node",
      args: ["dist/index.js"],
      env: { ...process.env }
    });

    const client = new Client({
      name: "socialdata-test-client",
      version: "1.0.0"
    }, {
      capabilities: {}
    });

    await client.connect(transport);
    console.log("✅ Connected to server\n");

    // Test 1: List available tools
    console.log("📋 Available tools:");
    const tools = await client.request({
      method: "tools/list"
    }, {});
    
    console.log(`Found ${tools.tools.length} tools:`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log("");

    // Test 2: Search for recent tweets
    console.log("🔍 Testing tweet search...");
    const searchResult = await client.request({
      method: "tools/call",
      params: {
        name: "search_tweets",
        arguments: {
          query: "from:elonmusk",
          type: "Latest"
        }
      }
    }, {});

    const searchData = JSON.parse(searchResult.content[0].text);
    console.log(`✅ Found ${searchData.tweets?.length || 0} tweets\n`);

    // Test 3: Get user profile
    console.log("👤 Testing user profile lookup...");
    const profileResult = await client.request({
      method: "tools/call",
      params: {
        name: "get_user_profile",
        arguments: {
          username: "twitter"
        }
      }
    }, {});

    const profileData = JSON.parse(profileResult.content[0].text);
    console.log(`✅ Found user: ${profileData.name} (@${profileData.screen_name})`);
    console.log(`   Followers: ${profileData.followers_count?.toLocaleString()}\n`);

    // Test 4: Get a specific tweet (if we found any)
    if (searchData.tweets && searchData.tweets.length > 0) {
      console.log("📝 Testing tweet details...");
      const tweetId = searchData.tweets[0].id_str;
      
      const tweetResult = await client.request({
        method: "tools/call",
        params: {
          name: "get_tweet",
          arguments: {
            tweet_id: tweetId
          }
        }
      }, {});

      const tweetData = JSON.parse(tweetResult.content[0].text);
      console.log(`✅ Retrieved tweet details`);
      console.log(`   Text: ${tweetData.full_text?.substring(0, 50)}...`);
      console.log(`   Likes: ${tweetData.favorite_count?.toLocaleString()}\n`);
    }

    console.log("✅ All tests passed!");
    console.log("\n🎉 Your SocialData MCP Server is working correctly!");

    // Cleanup
    await client.close();
    serverProcess.kill();
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    
    if (error.message.includes("402")) {
      console.error("\n💡 Tip: You may have insufficient credits in your SocialData account.");
      console.error("    Visit https://socialdata.tools to add credits.");
    } else if (error.message.includes("401")) {
      console.error("\n💡 Tip: Your API key may be invalid.");
      console.error("    Check your SOCIALDATA_API_KEY environment variable.");
    }
    
    process.exit(1);
  }
}

// Run tests
console.log("SocialData MCP Server Test Suite");
console.log("================================\n");

testServer().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});