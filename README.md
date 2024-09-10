# Terra Numina WebApp

## Overview

The project involves developing a web application for Terra Numina, focused on archiving and sharing focused discussions and resources related to land energy work, environmental topics, and spiritual practices. This application includes a content management system that allows admins to control and synchronize students, visitors and admin views. It features a responsive design for displaying discussion topics with author attribution and time stamps.

The backend is built using MongoDB, integrated into its cloud-based Atlas database environment for scalable data management. Local development is still available via localhost:27017 (see mongoMiddleware.js). The app is hosted [here](https://terra-numina-web.vercel.app), via Vercel.com facilitating deployment and global accessibility.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (latest version)
- [MongoDB](https://www.mongodb.com/try/download/community) (latest version)

## Project Setup

### 1. Clone the Repository

```bash
cd <your-repository-directory>
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

### 3. Setup MongoDB

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
Srat MongoDB using:
```bash
sudo systemctl start mongod
```
and enable it to run on boot:
```bash
sudo systemctl enable mongod
```
Check status:
```bash
sudo systemctl status mongod
```

### 4. Run the server
```bash
node server.js
```

Open the browser to this address:
```bash
http://localhost:3000/
```
### 5. Test remote connection to MongoDB:
```bash
curl http://localhost:3000/test-db-connection
```
