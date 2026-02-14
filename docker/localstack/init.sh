#!/bin/bash
# LocalStack initialization script
set -e

echo "Initializing LocalStack..."

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until awslocal s3 ls > /dev/null 2>&1; do
  echo "LocalStack not ready yet, waiting..."
  sleep 2
done

echo "LocalStack is ready. Creating resources..."

# Create S3 bucket
echo "Creating S3 bucket..."
awslocal s3 mb s3://tokn-app-bucket
awslocal s3api put-bucket-acl --bucket tokn-app-bucket --acl public-read

# Configure CORS for the bucket
echo "Configuring CORS..."
awslocal s3api put-bucket-cors \
  --bucket tokn-app-bucket \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
      }
    ]
  }'

# Create bucket policy
echo "Setting bucket policy..."
awslocal s3api put-bucket-policy \
  --bucket tokn-app-bucket \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::tokn-app-bucket/*"
      }
    ]
  }'

# Create IAM user for application (optional)
echo "Creating IAM user..."
awslocal iam create-user --user-name tokn-app-user

# Create access key for the user
echo "Creating access key..."
awslocal iam create-access-key --user-name tokn-app-user

echo "LocalStack initialization completed."

# List created resources
echo "Created resources:"
awslocal s3 ls
awslocal iam list-users