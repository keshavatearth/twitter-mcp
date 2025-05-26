#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("Claude Desktop Configuration Helper");
console.log("==================================\n");

// Determine the config file path based on the platform
let configPath;
if (process.platform === 'darwin') {
  configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
} else if (process.platform === 'win32') {
  configPath = path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
} else {
  configPath = path.join(os.homedir(), '.config', 'claude', 'claude_desktop_config.json');
}

console.log(`Config file location: ${configPath}\n`);

// Get the current directory
const serverPath = process.cwd();
const indexPath = path.join(serverPath, 'dist', 'index.js');

// Check if the server is built
if (!fs.existsSync(indexPath)) {
  console.error("❌ Error: Server not built. Run 'npm run build' first.");
  process.exit(1);
}

// Configuration to add
const mcpConfig = {
  socialdata: {
    command: "node",
    args: [indexPath],
    env: {
      SOCIALDATA_API_KEY: process.env.SOCIALDATA_API_KEY || "your_api_key_here"
    }
  }
};

console.log("Add this configuration to your Claude Desktop config file:\n");
console.log(JSON.stringify({ mcpServers: mcpConfig }, null, 2));

console.log("\n📝 Instructions:");
console.log("1. Open the config file in your text editor");
console.log("2. If the file doesn't exist, create it with the content above");
console.log("3. If it exists, add the 'socialdata' section to the 'mcpServers' object");
console.log("4. Replace 'your_api_key_here' with your actual SocialData API key");
console.log("5. Save the file and restart Claude Desktop");

// Offer to create the config file
if (!fs.existsSync(configPath)) {
  console.log("\n❓ Config file doesn't exist. Create it? (y/n)");
  
  process.stdin.once('data', (data) => {
    if (data.toString().trim().toLowerCase() === 'y') {
      // Create directory if it doesn't exist
      const configDir = path.dirname(configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // Write config file
      fs.writeFileSync(configPath, JSON.stringify({ mcpServers: mcpConfig }, null, 2));
      console.log(`\n✅ Config file created at: ${configPath}`);
      console.log("⚠️  Remember to update the API key in the config file!");
    }
    process.exit(0);
  });
} else {
  console.log("\n💡 Tip: You can also run this command to open the config file:");
  if (process.platform === 'darwin') {
    console.log(`   open "${configPath}"`);
  } else if (process.platform === 'win32') {
    console.log(`   notepad "${configPath}"`);
  } else {
    console.log(`   nano "${configPath}"`);
  }
}