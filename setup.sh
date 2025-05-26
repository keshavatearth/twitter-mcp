#!/bin/bash

echo "SocialData MCP Server Setup"
echo "=========================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo ""
echo "🔨 Building TypeScript..."
npm run build

# Check for API key
echo ""
if [ -z "$SOCIALDATA_API_KEY" ]; then
    echo "⚠️  Warning: SOCIALDATA_API_KEY environment variable is not set"
    echo ""
    echo "To set your API key:"
    echo "  export SOCIALDATA_API_KEY=your_api_key_here"
    echo ""
    echo "Get your API key at: https://socialdata.tools"
else
    echo "✅ SocialData API key found"
fi

# Create directory structure
mkdir -p src
if [ ! -f "src/index.ts" ]; then
    echo ""
    echo "📁 Moving TypeScript file to src directory..."
    mv index.ts src/index.ts 2>/dev/null || echo "   Note: index.ts should be in the src/ directory"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set your API key: export SOCIALDATA_API_KEY=your_key"
echo "2. Test the server: npm test"
echo "3. Configure Claude Desktop (see README.md)"
echo ""
echo "To run the server:"
echo "  npm start"
echo ""