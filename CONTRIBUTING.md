# Project Setup Documentation

## Development and Production Workflow

This document outlines the process for managing the project using a streamlined branch strategy suitable for an individual developer. This approach uses two primary branches to maintain a balance between simplicity and structured development. If a new developer takes over this project in the future, following this guide will ensure a smooth and consistent workflow.

## Table of Contents

1. [Git Workflow for Development and Production](#git-workflow-for-development-and-production)
2. [VS Code Configuration](#vs-code-configuration)
3. [GitHub Setup](#github-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Workflow Summary](#workflow-summary)

## 1. Git Workflow for Development and Production

The project uses two primary branches:

- **`main`**: The production branch for stable releases.
- **`development`**: The primary working branch for feature development and integration.

### Branch Creation and Workflow

1. **Create the Development Branch** (if it doesn't already exist):
   ```bash
   git checkout main
   git pull origin main
   git checkout -b development
   git push -u origin development
2. **Development Workflow**:

- Develop features in separate branches created from the `development` branch.
- Merge feature branches into `development` after testing and ensuring stability.
- Test the `development` branch locally or in a preview environment (e.g., Vercel) to ensure features are functioning as expected.
- Once stable and ready for production, merge the `development` branch into `main`.

## 2. VS Code Configuration

### Workspace Settings

To ensure a consistent local development environment, use `.vscode/settings.json` to define specific configurations for development and production.

- Example workspace settings:

  - **For development**:
    ```json
    {
      "terminal.integrated.env.osx": {
        "NODE_ENV": "development"
      },
      "files.autoSave": "onFocusChange"
    }
    ```

  - **For production**:
    ```json
    {
      "terminal.integrated.env.osx": {
        "NODE_ENV": "production"
      },
      "files.autoSave": "onWindowChange"
    }
    ```

### Recommended Extensions

For streamlined development, it is recommended to use the following VS Code extensions:

- **GitLens**: Enhances Git functionality and provides detailed insights into the project’s commit history.
- **Project Manager**: Helps manage multiple project states (development, production, etc.).

## 3. GitHub Setup

### Branch Protection and CI/CD

- **Branch Protection**:
  - Enable branch protection rules for `main` to ensure that all changes are made through pull requests.
  - Set up status checks (e.g., CI tests) to ensure code quality before merging into `main`.

- **GitHub Actions (Optional)**:
  - If you prefer automation for deployments, set up GitHub Actions to handle automatic deployments when changes are pushed to the `main` branch.

  - Example `.github/workflows/deploy.yml` for `main` deployment:
    ```yaml
    name: Deploy to Production

    on:
      push:
        branches:
          - main

    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout code
            uses: actions/checkout@v2

          - name: Deploy to Vercel
            run: vercel --prod --token=$VERCEL_TOKEN
            env:
              VERCEL_PROJECT_NAME: your-vercel-project
    ```

  - Don’t forget to add `VERCEL_TOKEN` as a secret in your GitHub repository to enable secure deployments.

## 4. Vercel Deployment

### Setting Up Production and Preview Environments

The project uses Vercel for deployment. To manage production and preview deployments, follow these steps:

- **Create a Vercel Project**:
  - If not already done, create a new project in Vercel.

- **Configure Environments**:
  - In the Vercel project settings, configure the following environments:
    - **Production**: This environment is tied to the `main` branch. Changes merged into `main` are automatically deployed to production.
    - **Preview**: This environment is automatically deployed for pull requests or changes in the `development` branch. It’s useful for testing features before they go live.

- **Environment Variables**:
  - Define the necessary environment variables for both production and preview environments.

- **Automatic Deployments**:
  - Vercel will automatically deploy any changes pushed to the `main` branch for production and provide preview deployments for any changes in the `development` branch.

## 5. Workflow Summary

To ensure the continuity of development, follow this branching and deployment strategy:

- **Feature Development**:
  - Create feature branches from `development` for new features or bug fixes.
  - After implementing and testing features locally, merge the feature branches into `development`.

- **Testing in Development**:
  - Test the `development` branch either locally or through Vercel's preview deployments. Ensure that all features are working as expected before considering them for production.

- **Production Release**:
  - Once the `development` branch is stable and all features are validated, merge it into `main`.
  - Vercel will automatically deploy the updated `main` branch to the production environment.
