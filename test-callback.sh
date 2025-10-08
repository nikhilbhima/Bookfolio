#!/bin/bash
# Test if callback is receiving the code parameter
echo "Testing callback endpoint..."
curl -I "https://www.bookfolio.me/auth/callback?code=test123"
