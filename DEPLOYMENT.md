# Deployment Guide: 1inch Fusion+ Native Bitcoin Resolver

This document provides a comprehensive, step-by-step guide for deploying the full-stack resolver application to a production-ready environment.

The chosen architecture is:
* **Frontend:** A static React single-page application hosted on **Firebase Hosting** for global CDN delivery, scalability, and ease of deployment.
* **Backend:** The Go application and a Bitcoin Core node, containerized with **Docker**, running on a dedicated root server from **Hetzner** for performance and control.
* **Networking:** **NGINX** will be used as a reverse proxy on the dedicated server to handle incoming traffic and secure the application with SSL.

---

## Part 1: Backend Deployment (Hetzner Dedicated Server)

This section covers provisioning the server and deploying the containerized Go backend and Bitcoin Core node.

### 1. Initial Server Provisioning & Setup

1.  **Provision Server:** From the Hetzner console, order a dedicated root server. During setup, select **Ubuntu 22.04** as the operating system.
2.  **Connect via SSH:** Once the server is ready, connect to it using the provided root credentials.
    ```bash
    ssh root@<your_server_ip>
    ```
3.  **Create a Non-Root User:** For security, we will not run services as root. Create a new user and give them sudo privileges.
    ```bash
    adduser zenith_admin
    usermod -aG sudo zenith_admin
    ```
4.  **Configure Firewall:** Set up a basic firewall to allow only necessary traffic (SSH, HTTP, HTTPS).
    ```bash
    ufw allow OpenSSH
    ufw allow http
    ufw allow https
    ufw enable
    ```
5.  **Log in as New User:** Disconnect and log back in as your new user.
    ```bash
    ssh zenith_admin@<your_server_ip>
    ```

### 2. Dependency Installation (Docker)

We will use Docker and Docker Compose to manage our services. This encapsulates dependencies and simplifies process management.

1.  **Install Docker:**
    ```bash
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    ```
2.  **Install Docker Compose:**
    ```bash
    sudo apt-get install -y docker-compose
    ```
3.  **Add User to Docker Group:** Allow your user to run Docker commands without `sudo`. You will need to log out and log back in for this to take effect.
    ```bash
    sudo usermod -aG docker ${USER}
    ```

### 3. Bitcoin Core & Backend Deployment with Docker Compose

1.  **Clone Your Project:** Clone your application repository onto the server.
    ```bash
    git clone <your-repository-url>
    cd zenith-defi # Or your project name
    ```
2.  **Create Bitcoin Configuration:** Inside the `backend` directory, create the `bitcoin.conf` file for your production environment (e.g., testnet or mainnet).
    ```ini
    # For mainnet
    # mainnet=1
    # For testnet
    testnet=1

    server=1
    txindex=1
    rpcuser=your_production_rpc_user
    rpcpassword=a_very_strong_production_password
    ```

3.  **Create the `docker-compose.yml` File:** In the `backend` directory, create a `docker-compose.yml` file. This file will define and link your Bitcoin node and your resolver application containers.

    ```yaml
    version: '3.8'

    services:
      # Bitcoin Core Node Service
      bitcoind:
        image: 'kylemanna/bitcoind'
        container_name: 'bitcoind_node'
        restart: unless-stopped
        volumes:
          # Mount the configuration file
          - ./bitcoin.conf:/bitcoin/.bitcoin/bitcoin.conf
          # Create a named volume for the blockchain data to persist it
          - bitcoin_data:/bitcoin/.bitcoin
        ports:
          # Expose RPC port only to other containers on the same Docker network
          # Do NOT expose this to the host machine for security
          - "18332:18332" # Testnet P2P port (optional, for peering)

      # Go Backend Resolver Service
      resolver:
        container_name: 'resolver_backend'
        restart: unless-stopped
        # Build the image from the Dockerfile in the current directory
        build: .
        ports:
          # Map the container's port 8080 to the host's port 8080
          - "8080:8080"
        depends_on:
          - bitcoind
        environment:
          # Pass environment variables from a .env file
          - "PORT=${PORT}"
          - "BTC_RPC_USER=${BTC_RPC_USER}"
          - "BTC_RPC_PASS=${BTC_RPC_PASS}"
          - "BTC_RPC_HOST=bitcoind_node" # Use the service name for inter-container communication
          - "EVM_RPC_URL=${EVM_RPC_URL}"
          - "EVM_PRIVATE_KEY=${EVM_PRIVATE_KEY}"
          - "EVM_CHAIN_ID=${EVM_CHAIN_ID}"
          - "ONEINCH_API_KEY=${ONEINCH_API_KEY}"

    volumes:
      bitcoin_data:
    ```

4.  **Create Production `.env` File:** In the `backend` directory, create the `.env` file that `docker-compose` will use.
    ```
    PORT=8080
    BTC_RPC_USER=your_production_rpc_user
    BTC_RPC_PASS=a_very_strong_production_password
    EVM_RPC_URL=<your_production_evm_rpc_url>
    EVM_PRIVATE_KEY=<your_production_evm_private_key>
    EVM_CHAIN_ID=137 # Or your target chain ID
    ONEINCH_API_KEY=<your_production_1inch_key>
    ```

5.  **Launch the Services:**
    ```bash
    # Build and start the containers in detached mode
    docker-compose up --build -d
    ```
    Your backend and Bitcoin node are now running. The Bitcoin node will begin syncing the blockchain, which will take a significant amount of time.

### 4. NGINX Reverse Proxy & SSL Setup

1.  **Install NGINX:**
    ```bash
    sudo apt-get install -y nginx
    ```
2.  **Configure NGINX:** Create a new NGINX server block configuration for your domain.
    ```bash
    sudo nano /etc/nginx/sites-available/resolver.yourdomain.com
    ```
    Paste the following configuration, replacing `resolver.yourdomain.com` with your actual domain.

    ```nginx
    server {
        listen 80;
        server_name resolver.yourdomain.com;

        location / {
            proxy_pass http://localhost:8080; # Forward traffic to the Go backend container
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  **Enable the Site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/resolver.yourdomain.com /etc/nginx/sites-enabled/
    sudo nginx -t # Test configuration
    sudo systemctl restart nginx
    ```
4.  **Set up SSL with Let's Encrypt:**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d resolver.yourdomain.com
    ```
    Follow the prompts. Certbot will automatically obtain an SSL certificate and configure NGINX to use it.

Your backend is now securely deployed and accessible at `https://resolver.yourdomain.com`.

---

## Part 2: Frontend Deployment (Firebase Hosting)

### 1. Firebase Project Setup

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  Navigate to the "Hosting" section and click "Get started".

### 2. Install Firebase CLI and Initialize Project

1.  **Install CLI:** If you don't have it, install the Firebase command-line tool globally.
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login:**
    ```bash
    firebase login
    ```
3.  **Initialize Hosting:** In the **root directory** of your local project (`zenith-defi`), run:
    ```bash
    firebase init hosting
    ```
    Follow the prompts:
    * Select **"Use an existing project"** and choose the project you created.
    * What do you want to use as your public directory? **`build`**
    * Configure as a single-page app (rewrite all urls to /index.html)? **Yes**
    * Set up automatic builds and deploys with GitHub? **No** (for now)

### 3. Configure Frontend Environment

Your React app needs to know the URL of your deployed backend.

1.  In your `src` directory, create a `.env.production` file.
2.  Add the production API URL:
    ```
    REACT_APP_API_BASE_URL=[https://resolver.yourdomain.com](https://resolver.yourdomain.com)
    ```
3.  In your `ApiService.js`, use this environment variable:
    ```javascript
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    // ... new ApiService(baseUrl)
    ```

### 4. Build and Deploy Frontend

1.  **Create Production Build:**
    ```bash
    npm run build
    ```
2.  **Deploy to Firebase:**
    ```bash
    firebase deploy --only hosting
    ```

Your frontend is now live and accessible at the URL provided by Firebase. It is configured to communicate with your secure, dedicated backend server.
