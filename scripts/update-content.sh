#!/bin/bash

echo "🚀 Updating content statistics..."

# Generate new statistics
node scripts/generate-content-stats.js

if [ $? -eq 0 ]; then
    echo "✅ Content statistics updated successfully!"
    echo ""
    echo "📊 Summary:"
    echo "Countries: $(jq 'keys | length' src/data/countries.json)"
    echo "Total Posts: $(jq '.totalPosts' src/data/blog-index.json)"
    echo "Total Images: $(jq '.totalImages' src/data/gallery-index.json)"
    echo ""
    echo "🔄 Ready to commit and push!"
else
    echo "❌ Failed to update content statistics"
    exit 1
fi