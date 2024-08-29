# Terra Numina WebApp

## Overview

Brief description of the project.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version X.X.X)
- [MongoDB](https://www.mongodb.com/try/download/community) (version X.X.X)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```
### 2. Install dependencies
```bash
npm install
```
This will install all the dependencies listed in package.json, including:

- mongoose: MongoDB object modeling tool.
- cors: Middleware for enabling Cross-Origin Resource Sharing.
- helmet: Middleware for securing Express apps by setting various HTTP headers.

### 3. Creting a new Node.js Project (inf starting from scratch)

```bash
mkdir knowledge-platform-backend
cd knowledge-platform-backend
npm init -y
npm install express mongoose body-parser cors

```
### 4. Setup MongoDB

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
### 5. Run the server
```bash
node server.js
```

Open the browser to this address:
```bash
http://localhost:3000/
```
