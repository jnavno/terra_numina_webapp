# Terra Numina WebApp

## Overview

The Terra Numina WebApp is designed to archive and share discussions and resources on land energy work, environmental topics, and spiritual practices. It includes a content management system for admins to manage views and features a responsive design for displaying discussion topics with author details and timestamps.

- **Backend**: Built with MongoDB, using Atlas for scalable data management.
- **Local Development**: Uses `MONGODB_URI_LOCAL`.
- **Production**: Uses `MONGODB_URI_PROD`.
- **Hosted**: [Terra Numina WebApp](https://terra-numina-web.vercel.app) via Vercel.

## Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/) (latest version)
- [MongoDB](https://www.mongodb.com/try/download/community) (latest version)

## Setup Instructions

### 1. Clone the Repository

```bash
cd terra_numina_web
git clone git@github.com:jnavno/terra_numina_web.git
```
### 2. Install dependencies
```bash
npm install
```
This will install all the dependencies listed in package.json, including:

- mongoose: MongoDB object modeling tool.
- cors: Middleware for enabling Cross-Origin Resource Sharing.
- helmet: Middleware for securing Express apps by setting various HTTP headers.

### 3. Setup MongoDB (Local Development)

Create a MongoDB repository configuration file for yum:
```bash
sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF
```
Install MOngoDB:
```bash
sudo dnf install -y mongodb-org
```
Srat and enable MongoDB:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```
Check MongoDB status:
```bash
sudo systemctl status mongod
```

### 4. Run the server
```bash
npm start
```
- Local Development: Set NODE_ENV=development.
- Production: Set NODE_ENV=production (handled automatically on Vercel).

## Environment Variables

Create a .env file in the root directory with the following variables:

   - MONGODB_URI_LOCAL: MongoDB URI for local development.
   - MONGODB_URI_PROD: MongoDB URI for production.
   - SESSION_SECRET: Secret key for session management.

## Testing
### 1. Test Local Server
Open the browser to this address:
```bash
http://localhost:3000/
```
### 2. Test MongoDB Connection
```bash
curl http://localhost:3000/test-db-connection
```

