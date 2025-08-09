#!/bin/bash

# Test script for GitHub webhook functionality
# This script tests the webhook endpoint with sample payloads

API_BASE_URL="http://localhost:8080/api/v1"

echo "🔧 Testing GitHub Webhook Comment Interaction"
echo "=============================================="

# Test 1: Create a bot response configuration
echo ""
echo "📝 Creating bot response configuration..."
curl -X POST "${API_BASE_URL}/github-webhooks/configs" \
  -H "Content-Type: application/json" \
  -d '{
    "repository_pattern": "test/*",
    "mention_keywords": ["test", "help"],
    "response_template": "Hello @{user}! This is a test response for {issue_title}.",
    "enabled": true,
    "priority": 5
  }' | jq '.'

# Test 2: List bot response configurations
echo ""
echo "📋 Listing bot response configurations..."
curl -X GET "${API_BASE_URL}/github-webhooks/configs" | jq '.'

# Test 3: Send a test webhook with bot mention
echo ""
echo "🤖 Sending test webhook with bot mention..."
curl -X POST "${API_BASE_URL}/github-webhooks/webhook" \
  -H "Content-Type: application/json" \
  -H "x-github-event: issue_comment" \
  -d '{
    "action": "created",
    "issue": {
      "id": 12345,
      "number": 1,
      "title": "Test Issue",
      "body": "This is a test issue",
      "html_url": "https://github.com/test/repo/issues/1",
      "state": "open",
      "user": {
        "login": "testuser",
        "id": 67890,
        "avatar_url": "https://github.com/testuser.png",
        "html_url": "https://github.com/testuser"
      }
    },
    "comment": {
      "id": 98765,
      "body": "Hello @botmaster test, can you help with this?",
      "html_url": "https://github.com/test/repo/issues/1#issuecomment-98765",
      "user": {
        "login": "commenter",
        "id": 54321,
        "avatar_url": "https://github.com/commenter.png",
        "html_url": "https://github.com/commenter"
      },
      "created_at": "2023-08-01T12:00:00Z",
      "updated_at": "2023-08-01T12:00:00Z"
    },
    "repository": {
      "id": 11111,
      "name": "repo",
      "full_name": "test/repo",
      "html_url": "https://github.com/test/repo",
      "owner": {
        "login": "test",
        "id": 22222,
        "avatar_url": "https://github.com/test.png",
        "html_url": "https://github.com/test"
      }
    }
  }' | jq '.'

# Test 4: Send a test webhook without bot mention
echo ""
echo "💬 Sending test webhook without bot mention..."
curl -X POST "${API_BASE_URL}/github-webhooks/webhook" \
  -H "Content-Type: application/json" \
  -H "x-github-event: issue_comment" \
  -d '{
    "action": "created",
    "issue": {
      "id": 12346,
      "number": 2,
      "title": "Another Test Issue",
      "body": "This is another test issue",
      "html_url": "https://github.com/test/repo/issues/2",
      "state": "open",
      "user": {
        "login": "testuser",
        "id": 67890,
        "avatar_url": "https://github.com/testuser.png",
        "html_url": "https://github.com/testuser"
      }
    },
    "comment": {
      "id": 98766,
      "body": "This comment does not mention the bot",
      "html_url": "https://github.com/test/repo/issues/2#issuecomment-98766",
      "user": {
        "login": "commenter",
        "id": 54321,
        "avatar_url": "https://github.com/commenter.png",
        "html_url": "https://github.com/commenter"
      },
      "created_at": "2023-08-01T12:00:00Z",
      "updated_at": "2023-08-01T12:00:00Z"
    },
    "repository": {
      "id": 11111,
      "name": "repo",
      "full_name": "test/repo",
      "html_url": "https://github.com/test/repo",
      "owner": {
        "login": "test",
        "id": 22222,
        "avatar_url": "https://github.com/test.png",
        "html_url": "https://github.com/test"
      }
    }
  }' | jq '.'

# Test 5: List webhook events
echo ""
echo "📊 Listing webhook events..."
curl -X GET "${API_BASE_URL}/github-webhooks/events?limit=10" | jq '.'

echo ""
echo "✅ Testing completed!"
echo ""
echo "📋 To manually test:"
echo "1. Start the API server: cd apps/api && pnpm dev"
echo "2. Run this script: ./test-webhook.sh"
echo "3. Check the logs for processing details"
echo "4. Visit http://localhost:8080/api-docs/v1 for API documentation"