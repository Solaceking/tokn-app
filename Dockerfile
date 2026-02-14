# Multi-stage Dockerfile for Next.js production
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache openssl

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG ENCRYPTION_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
ENV ENCRYPTION_KEY=$ENCRYPTION_KEY

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install dumb-init for better signal handling
RUN apk add --no-cache dumb-init openssl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start the application using dumb-init for proper signal handling
CMD ["dumb-init", "node", "server.js"]
