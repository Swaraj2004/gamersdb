# GamersDB

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Technical Overview](#technical-overview)
- [Installation](#installation)
- [Screenshots](#screenshots)

## Introduction

Welcome to Gamer's Database – a free platform for discovering, organizing, and sharing your video game collections with friends. With a user-friendly interface and access to a comprehensive game database, you can easily curate your library, explore new titles, and stay updated with the latest gaming news, all in one place.

## Key Features

- **User Accounts**: Personalized management of game collections.
- **Game Catalog Integration**: Access detailed game information, including titles, genres, and ratings.
- **Collection Organization**: Categorize games efficiently for easy access.
- **Social Engagement**: Share collections and connect with friends.
- **Latest Gaming News**: Stay updated with real-time news on trending games, industry updates, and exclusive releases.
- **Upcoming and recently Released**: View a curated list of newly released and upcoming games.

## Technical Overview

Gamer's Database utilizes modern web technologies to provide a robust solution:

- **Frontend**: Built using **Next.js**, **Tailwind CSS**, and **TypeScript** for a dynamic and responsive user experience.
- **Backend**: Powered by **Node.js** and **Express** for handling requests, with **MongoDB** for data storage.

| Technology       | Description                                   |
|------------------|-----------------------------------------------|
| Next.js          | React framework for building web applications |
| Tailwind CSS     | Utility-first CSS framework for styling       |
| Node.js          | JavaScript runtime for server-side code       |
| Express          | Web framework for building APIs               |
| MongoDB          | NoSQL database for flexible data storage      |

## Installation

To set up the Gamer's Database project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Swaraj2004/gamersdb.git
   cd gamersdb
   ```

2. **For setting Backend**:

   2.1. **Install dependencies**:

   ```bash
   cd server
   pnpm install
   ```

   2.2. **Set up MongoDB**:
   - Create a MongoDB account and set up a new database.
   - Obtain your MongoDB connection string.

   2.3. **Set up environment variables**:
   Create a `.env` file in the web directory and add your MongoDB credentials:

   ```
   DATABASE_URI=your_mongodb_connection_string
   NEWS_API_KEY=your_news_api_key
   TWITCH_CLIENT_ID=your_twitch_app_client_id
   TWITCH_APP_ACCESS_TOKEN=your_twitch_app_acess_token
   ACCESS_TOKEN_SECRET=your_acess_token
   REFRESH_TOKEN_SECRET=your_refresh_token
   ```

   **NOTE**
   - For News Api key visit [News API](https://newsapi.org/)
   - For Twitch Client ID Create a twitch developer account and create an application.
   - For Generating Twitch App Acess Token Follow [IGDB API DOCS](https://api-docs.igdb.com/#authentication)

   2.4. **Run the application**:
   To run the web application:

   ```bash
   pnpm dev
   ```
   
3. **For setting Frontend**:

   3.1. **Install dependencies**:

   ```bash
   cd client
   pnpm install
   ```

   3.2. **Set up environment variables**:
   Create a `.env.local` file in the web directory and add your MongoDB credentials:

   ```
   NEXT_PUBLIC_API_URL=your_backend_site_url
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=your_client_site_url   
   ```

   3.3. **Run the application**:

   For the web application:

   ```bash
   pnpm dev
   ```

## Screenshots

![Home 1](https://i.imgur.com/mbJBMqW.png)
![Home 2](https://i.imgur.com/xJziGND.png)
![Search](https://i.imgur.com/cni4j00.png)
![Game Details](https://i.imgur.com/NdyfR04.png)
![Friends](https://i.imgur.com/ksFdKiE.png)
![Collections](https://i.imgur.com/r5Ha00p.png)
![Collection](https://i.imgur.com/88UuV02.png)
