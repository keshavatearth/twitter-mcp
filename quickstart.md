# SocialData MCP Server - Quick Start

## 1. Prerequisites
- Node.js 18+ installed
- SocialData API key from [https://socialdata.tools](https://socialdata.tools)

## 2. Installation (5 minutes)

```bash
# Clone/download the repository, then:
cd socialdata-mcp-server

# Run automatic setup
chmod +x setup.sh
./setup.sh

# Set your API key
export SOCIALDATA_API_KEY=your_actual_api_key_here

# Test the installation
npm test
```

## 3. Configure Claude Desktop (2 minutes)

```bash
# Run the configuration helper
npm run configure
```

Then restart Claude Desktop.

## 4. Start Using!

In Claude Desktop, you can now ask questions like:

- "Search for recent tweets about AI from Elon Musk"
- "Get the profile information for @openai"
- "Find tweets with #MachineLearning that have over 1000 likes"
- "Check if @jack follows @elonmusk"
- "Get the comments on tweet ID 1890269299287441612"

## File Structure

```
socialdata-mcp-server/
├── src/index.ts         # Server code (move here after creation)
├── test/test.ts         # Test script (move here after creation)
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── setup.sh            # Setup script
├── configure-claude.js  # Claude Desktop helper
└── README.md           # Full documentation
```

## Common Commands

```bash
npm run build     # Build the TypeScript code
npm start        # Start the server
npm test         # Run tests
npm run dev      # Development mode with hot reload
npm run configure # Configure Claude Desktop
```

## Need Help?

1. Check the README.md for detailed documentation
2. See examples.md for usage examples
3. Verify your API key is set correctly
4. Ensure you have sufficient SocialData credits

## Troubleshooting

**"API key not found"**
```bash
export SOCIALDATA_API_KEY=your_key_here
```

**"Insufficient credits" (402 error)**
- Add credits at https://socialdata.tools

**"Cannot find module"**
```bash
npm install
npm run build
```

**Claude Desktop doesn't see the server**
- Restart Claude Desktop after configuration
- Check the config file path is correct
- Verify the server path in the config

---

🎉 You're ready to analyze Twitter/X data with Claude!