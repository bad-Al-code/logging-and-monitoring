# Microservice Project with Centralized Observability

This repository contains a set of microservices built with Node.js TypeScript, and Express. The primary goal og this project is to demonstrate a robust, event-driven architecture and to implement a centralized logging and monitoring solution using the Prometheus, Loki and Grafana (PLG) stack running in a local Kubernetes (Kind) cluster.

## Architecture Overview

The system is composed of several indepenedent services that communicate asynchronously via a Redis Streams event bus.

### Core Services

1. **Auth Service (`/services/auth`):** Responsible for user registration, login, and issuing JWTs. It owns user credential data and publishes a `user.created` event upon successful registration.

2. **Users Service (`/services/users`):** Manages user profile information (name, bio, etc.). It subscribes to the `user.created` event to create a corresponding user profile.
3. **Notification Service (`/services/notification`):** Handles sending notifications to users. It subscribes to events like `user.created` to send welcome messages.

### Technology Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (with Drizzle ORM)
- **Event Bus:** Redis Streams
- **Containerization:** Docker
- **Local Orchestration:** Kubernetes (Kind) on WSL2
- **Observability:** Prometheus, Loki, Grafana

## Project Goals

1.  Build three decoupled microservices following best practices.
2.  Implement a secure authentication and authorization flow.
3.  Use event-driven communication to ensure service autonomy.
4.  Containerize all services for consistent environments.
5.  Deploy the entire stack to a local Kubernetes cluster using Kind.
6.  Set up a centralized logging and monitoring system to gain insights into the application's performance and behavior.

## Getting Started

Each service within the `/services` directory is a standalone application with its own dependencies and scripts. To work with a specific service, navigate to its directory:

```bash
cd services/<service-name>
npm install
# ... and follow the service-specific README for further instructions.
```
