
# Express with TypeScript and MongoDB

This is a basic project setup using **Express**, **TypeScript**, and **MongoDB** to create an API for managing stores. The project uses **Mongoose** for MongoDB interaction, **CORS** for handling cross-origin requests, and **dotenv** for managing environment variables. **Nodemon** is used for automatic server restarts during development.

## Features

- **Express** backend with TypeScript support
- **MongoDB** for data storage
- **CORS** middleware for handling cross-origin requests
- **dotenv** for environment variable management
- **Nodemon** for automatic server restarts during development

## Requirements

- **Node.js** (v14 or later)
- **MongoDB** (either locally or a MongoDB Atlas cluster)

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/express-ts-mongo.git cd express-ts-mongo
```

2.  Install dependencies:
```
npm install

```
3. Set up environment variables:

-   Create a `.env` file in the root directory and add the following:
```
MONGO_URI=mongodb://localhost:27017/express-ts-mongo
PORT=5000
```