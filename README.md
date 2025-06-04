# Story App

A web application for sharing stories built with JavaScript using the Model-View-Presenter (MVP) architecture pattern. The app interacts with the Dicoding Story API to allow users to view, create, and explore stories.

## Features

- View list of stories
- Add new story with photo upload
- View story details
- Responsive design
- Modern UI with Bootstrap 5

## Architecture

The application follows the MVP (Model-View-Presenter) pattern:

- **Model**: Handles data and API calls
- **Presenter**: Manages business logic and communication between Model and View
- **View**: Handles UI rendering and user interactions

Each feature is organized in its own directory with dedicated Model, View, and Presenter files.

## Project Structure

```
src/
├── scripts/
│   ├── pages/
│   │   ├── story-list/
│   │   │   ├── story-list-model.js
│   │   │   ├── story-list-presenter.js
│   │   │   └── story-list-view.js
│   │   ├── add-story/
│   │   │   ├── add-story-model.js
│   │   │   ├── add-story-presenter.js
│   │   │   └── add-story-view.js
│   │   └── story-detail/
│   │       ├── story-detail-model.js
│   │       ├── story-detail-presenter.js
│   │       └── story-detail-view.js
│   └── app.js
└── styles/
    └── main.css
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at the URL shown in the terminal

## Dependencies

- Bootstrap 5.3.0 - UI framework
- SweetAlert2 11.7.0 - Beautiful alerts and notifications
- Vite 4.5.0 - Build tool and development server

## API Integration

The app uses the Dicoding Story API (https://story-api.dicoding.dev/v1/) with the following endpoints:

- GET /stories - Fetch list of stories
- POST /stories - Create new story
- GET /stories/:id - Get story details
