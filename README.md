# Contact Manager App

A simple Express.js application with EJS templates that allows users to save name and address information to MongoDB Atlas and is deployable on Vercel.

## Features

- Add contacts with name and address
- View all saved contacts
- Responsive design with custom CSS
- MongoDB Atlas integration
- Vercel deployment ready

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account
- Vercel account (for deployment)

### Local Development

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   ```
4. Replace `your_mongodb_atlas_connection_string_here` with your actual MongoDB Atlas connection string
5. Start the development server:
   ```
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000`

### Deployment to Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
2. Login to Vercel:
   ```
   vercel login
   ```
3. Deploy the application:
   ```
   vercel
   ```
4. Add your MongoDB Atlas connection string as an environment variable in the Vercel dashboard

## Project Structure

```
.
├── index.js                # Main server file
├── models/                 # MongoDB models
│   └── Contact.js          # Contact model
├── public/                 # Static assets
│   └── css/                # CSS files
│       └── style.css       # Main stylesheet
├── views/                  # EJS templates
│   ├── layout.ejs          # Main layout template
│   ├── index.ejs           # Home page with form
│   ├── success.ejs         # Success page
│   ├── contacts.ejs        # All contacts page
│   └── error.ejs           # Error page
├── .env                    # Environment variables
├── package.json            # Project dependencies
└── vercel.json             # Vercel configuration
```
