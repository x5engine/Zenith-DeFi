1inch Fusion+ Native Bitcoin Resolver
=====================================

### A Production-Grade Backend for Trustless BTC-to-EVM Swaps

1\. The Challenge: Unlocking Bitcoin's Trillion-Dollar Liquidity for DeFi
-------------------------------------------------------------------------

The single largest pool of decentralized capital, Bitcoin, remains largely isolated from the vibrant, multi-chain world of DeFi. While wrapped solutions like wBTC have been a temporary bridge, they introduce custodial risk and centralization, running counter to the core principles of DeFi.

The 1inch Fusion+ protocol, with its powerful HTLC-based architecture, provides the cryptographic foundation to solve this problem. However, a robust, production-ready backend is required to orchestrate these complex native cross-chain swaps. **This project builds that backend.**

2\. The Solution: A Production-Ready Resolver Service
-----------------------------------------------------

This repository contains a complete, production-grade resolver backend service, written in Go (Golang), designed to facilitate trustless, atomic swaps between native Bitcoin and any asset on a 1inch-supported EVM chain.

It is not just a proof-of-concept; it is a scalable, secure, and modular piece of infrastructure built to the standards required for a real-world financial service. Our service acts as the "brain" for a 1inch Fusion+ resolver, managing the entire swap lifecycle from end to end.

### Key Features:

-   **Native Bitcoin Integration:** Utilizes native SegWit transactions and Bitcoin Script to create true, trustless HTLCs on the Bitcoin blockchain.

-   **Production-Grade Stack:** Built with Go, a high-performance language ideal for concurrent, mission-critical network services.

-   **Full Lifecycle Orchestration:** Manages the entire swap state machine, from monitoring BTC deposits to executing EVM fulfillment and final BTC settlement.

-   **Modular Architecture:** Cleanly separated components for configuration, blockchain services (BTC & EVM), and API handling, making the system robust and maintainable.

-   **Ready for Deployment:** Fully containerized with a multi-stage `Dockerfile` for secure and scalable deployment.

3\. Why This Project Wins
-------------------------

This project directly answers the most ambitious and valuable 1inch hackathon bounty: **"Add BTC first."**

-   **Protocol-Level Contribution:** We go beyond simply *using* an API. We have built the foundational backend required to *extend* the 1inch protocol to the most significant non-EVM chain.

-   **Technical Excellence:** The choice of Go, the modular architecture, the secure configuration management, and the containerized deployment demonstrate a professional, production-focused approach.

-   **Completeness:** We have provided a fully-architected solution, complete with detailed documentation, that can serve as the definitive blueprint for 1inch's expansion into the native Bitcoin ecosystem.

4\. Dive Deeper
---------------

-   **To get the service running locally, see our detailed installation guide:**

    -   [**INSTALL.md**](https://www.google.com/search?q=./INSTALL.md "null")

-   **For a technical deep-dive into the system's design and swap lifecycle, read our architecture overview:**

    -   [**ARCHITECTURE.md**](https://www.google.com/search?q=./ARCHITECTURE.md "null")