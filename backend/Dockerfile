# ==============================================================================
# File 8: Dockerfile - Containerization for Deployment
# ==============================================================================
#
# PURPOSE:
# This Dockerfile packages the Go application into a container image. It uses a
# multi-stage build process, which is a best practice for Go applications to
# create small, secure, and efficient production images.
#
# STAGE 1: The "builder" stage
# - Uses a full Go base image.
# - Copies the source code into the container.
# - Downloads all necessary Go modules.
# - Compiles the Go application into a single, statically-linked binary.
#
# STAGE 2: The "final" stage
# - Uses a minimal, lightweight base image (Alpine Linux).
# - Copies *only* the compiled binary from the "builder" stage.
# - This results in a very small final image that doesn't contain the Go
#   toolchain or the source code, significantly reducing the attack surface.
#

# --- Stage 1: Build the application ---
FROM golang:1.19-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Go module files and download dependencies.
# This is done in a separate layer to leverage Docker's build cache.
# Dependencies will only be re-downloaded if go.mod or go.sum changes.
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application.
# - CGO_ENABLED=0: Disables CGO to create a statically-linked binary.
# - -o /app/resolver: Specifies the output file for the compiled binary.
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/resolver .

# --- Stage 2: Create the final, lightweight image ---
FROM alpine:latest

# Alpine Linux is a minimal Docker image based on Alpine Linux, which is
# a security-oriented, lightweight Linux distribution.

# It's good practice to run containers as a non-root user.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /home/appuser

# Copy the compiled binary from the "builder" stage.
COPY --from=builder /app/resolver .

# Expose the port the server will run on.
EXPOSE 8080

# The command to run when the container starts.
# This executes our compiled Go application.
CMD ["./resolver"]
