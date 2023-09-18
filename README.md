# Odin-facebook
# Odin-facebook - A Social Media Platform

Odin-facebook is a simple social media platform where users can create posts, connect with friends, send friend requests, and interact with each other's posts. This README provides an overview of the project's structure, functionality, and how to set it up.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)

## Features
FriendBook offers the following features:

- User authentication (sign-up, log-in, and log-out).
- Creating, deleting, and viewing user posts.
- Sending and accepting friend requests.
- Viewing friends' posts.
- Deleting friends.
- Viewing a friend's posts.

## Project Structure
The project is structured as follows:

- `controllers`: Contains controller functions for handling requests.
- `models`: Defines Mongoose models for User, Post, and Friendship.
- `routes`: Defines Express routes for handling various functionalities.
- `views`: Contains Jade templates for rendering HTML pages.
- `public`: Static assets (stylesheets, images, etc.).
- `app.js`: The main Express application file.
- `.env`: Configuration file for environment variables.
- `package.json`: Project dependencies and scripts.
- `README.md`: This file.

## Getting Started

### Prerequisites
Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

### Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/friendbook.git
   ```

2. Navigate to the project directory:
   ```bash
   cd friendbook
   ```

3. Install the project dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env` file in the project root directory and add the following configuration:

   ```env
   MONGODB_URI=your-mongodb-connection-uri
   ```

   Replace `your-mongodb-connection-uri` with the URI for your MongoDB database.

2. Generate a secret key for session management and add it to the `.env` file:

   ```env
   SESSION_SECRET=your-secret-key
   ```

   Replace `your-secret-key` with a secure secret key.

## Usage
1. Start the application:
   ```bash
   npm start
   ```

2. Open a web browser and go to `http://localhost:3000` to access the FriendBook application.

3. Sign up with a new account or log in with an existing one.

4. Explore the application's features, such as creating posts, sending friend requests, accepting requests, viewing friends' posts, and more.

## Contributing
If you'd like to contribute to this project, please follow these guidelines:
- Fork the repository.
- Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
- Make your changes and test thoroughly.
- Commit your changes: `git commit -m "Description of your changes"`.
- Push to your fork: `git push origin feature-name`.
- Create a pull request to the `main` branch of the original repository.
