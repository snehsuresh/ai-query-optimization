#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]
then
  echo "Error: No commit message provided."
  echo "Usage: ./push \"Your commit message\""
  exit 1
fi

# Add all changes
git add .

# Commit with the provided message
git commit -m "$1"

# Push changes to the current branch
git push

# Confirmation message
echo "Changes have been added, committed, and pushed."
