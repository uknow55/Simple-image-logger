# ImageLogger - Project Requirements

## System Requirements

### Runtime Environment
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: 100MB for application + storage for uploaded images

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

### Core Framework
- **express**: ^4.18.2 - Web application framework
- **typescript**: ^5.0.0 - TypeScript compiler
- **vite**: ^4.0.0 - Build tool and development server

### Frontend Libraries
- **react**: ^18.2.0 - UI framework
- **react-dom**: ^18.2.0 - React DOM renderer
- **wouter**: ^2.11.0 - Client-side routing
- **@tanstack/react-query**: ^4.29.0 - Server state management

### UI Components
- **@radix-ui/react-***: Various components for accessible UI
- **tailwindcss**: ^3.3.0 - Utility-first CSS framework
- **lucide-react**: ^0.263.1 - Icon library

### Backend Utilities
- **multer**: ^1.4.5 - File upload handling
- **nanoid**: ^4.0.2 - Unique ID generation
- **drizzle-orm**: ^0.28.0 - Type-safe ORM
- **zod**: ^3.21.0 - Schema validation

### Development Tools
- **@types/node**: ^20.0.0 - Node.js type definitions
- **@types/express**: ^4.17.17 - Express type definitions
- **tsx**: ^3.12.0 - TypeScript execution
- **esbuild**: ^0.18.0 - Fast JavaScript bundler

## Environment Setup

### Required Environment Variables
- `NODE_ENV`: development | production
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string (optional for in-memory storage)

### Optional Configuration
- `UPLOAD_DIR`: Custom upload directory (default: ./uploads)
- `MAX_FILE_SIZE`: Maximum upload size in bytes (default: 10MB)

## Database Schema

### Tables
1. **users**: Basic user authentication
2. **images**: Image metadata and statistics
3. **clicks**: Detailed click tracking data
4. **sessions**: User session information

### Storage Options
- **In-Memory**: Default for development (MemStorage class)
- **PostgreSQL**: Production database with Drizzle ORM

## Features

### Core Functionality
- ✅ Image upload and management
- ✅ Real-time click tracking with coordinates
- ✅ Geographic location collection (with consent)
- ✅ Session duration tracking
- ✅ Device and browser analytics

### Admin Features
- ✅ Image upload interface with drag-and-drop
- ✅ Set active image for public viewing
- ✅ Image deletion and management
- ✅ Quick statistics overview
- ✅ Data export functionality

### Analytics Dashboard
- ✅ Real-time click statistics
- ✅ Geographic distribution visualization
- ✅ Click trend analysis over time
- ✅ Detailed click data table with search
- ✅ Session duration metrics

### Privacy & Compliance
- ✅ Transparent data collection notice
- ✅ Optional geolocation permission
- ✅ Anonymized data storage
- ✅ Educational use disclosure

## Installation

```bash
# Clone repository
git clone <https://github.com/uknow55/Simple-image-logger.git>
cd imagelogger

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## File Structure

```
├── client/src/           # Frontend React application
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries
│   └── pages/           # Page components
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Data storage interface
│   └── vite.ts          # Vite integration
├── shared/              # Shared type definitions
│   └── schema.ts        # Database schema and types
├── uploads/             # Image storage directory
└── package.json         # Node.js dependencies
```

## Performance Considerations

### Frontend
- React Query for efficient data caching
- Lazy loading for large image galleries
- Optimized bundle size with tree shaking

### Backend
- In-memory storage for fast development
- Efficient file upload handling with Multer
- Streaming support for large file downloads

### Database
- Indexed columns for fast queries
- Pagination for large datasets
- Efficient aggregation queries for analytics

## Security Features

- File type validation for uploads
- File size limits (10MB default)
- Input sanitization with Zod schemas
- CORS protection for API endpoints
- Secure session management

## Development Workflow

1. **Development**: `npm run dev` - Hot reload with Vite
2. **Type Checking**: TypeScript compiler validates all code
3. **Build**: `npm run build` - Optimized production build
4. **Production**: `npm start` - Serve built application

## Browser Permissions

### Required
- Basic web functionality (no special permissions)

### Optional
- **Geolocation**: For enhanced analytics (user must grant)
- **File System**: For drag-and-drop uploads (browser handles)

## Data Storage

### Development
- In-memory storage (data lost on restart)
- Local file system for uploaded images
- No database setup required

### Production
- PostgreSQL database recommended
- Persistent file storage
- Environment variable configuration
