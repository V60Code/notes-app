# Story App

A Progressive Web App (PWA) for sharing stories with features like offline capability, push notifications, and location-based stories.

## Features

- 📱 Progressive Web App (PWA)
  - Installable to homescreen
  - Works offline
  - Push notifications
- 🔐 Authentication
  - Login
  - Register
  - Secure token management
- 📖 Stories
  - View stories
  - Add new stories
  - Location-based stories with maps
- 💾 Offline Support
  - IndexedDB for data persistence
  - Background sync for offline actions
  - Cache API for assets
- 🗺️ Maps Integration
  - View stories on map
  - Add location to stories
  - Interactive map interface

## Tech Stack

- Frontend Framework: Vanilla JavaScript with Web Components
- Build Tool: Vite
- PWA: VitePWA
- Maps: Leaflet.js
- Storage: IndexedDB
- Styling: CSS3 with Bootstrap

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/V60Code/notes-app.git
cd notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## PWA Features

- **Offline First**: Works without internet connection
- **Installable**: Can be added to homescreen
- **Push Notifications**: Real-time updates
- **Background Sync**: Queue actions when offline
- **Responsive**: Works on all devices

## Project Structure

```
src/
├── scripts/
│   ├── components/    # Web components
│   ├── pages/         # Page components
│   ├── routes/        # Routing logic
│   ├── services/      # API services
│   └── utils/         # Utility functions
├── styles/           # CSS styles
└── public/          # Static assets
```

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
