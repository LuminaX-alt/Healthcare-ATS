# 🏥 Healthcare Management System

A comprehensive healthcare management platform with AI-powered assistance, built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🔐 Multi-Portal Access
- **Doctor Portal**: Patient management, appointments, medical records
- **Admin Portal**: User management, system administration
- **Reports Portal**: Analytics and reporting dashboard
- **Pharmacist Portal**: Prescription management, inventory
- **Patient Portal**: View medical records, book appointments

### 🤖 AI Assistant (Alt-X)
- Powered by **Google Gemini AI** (gemini-2.5-flash model)
- Real-time medical information assistance
- Smart query processing with context awareness
- Integrated across all portals

### 📊 Core Functionality
- Patient Management System
- Appointment Scheduling
- Medical Records Management
- Prescription Tracking
- Analytics & Reporting
- User Role Management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd healthcare-prototype
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ..
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example server/.env
   
   # Edit server/.env with your actual values
   # Required:
   # - MONGODB_URI
   # - JWT_SECRET
   # - GEMINI_API_KEY (for AI features)
   ```

4. **Start MongoDB**
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongodb
   
   # Windows
   net start MongoDB
   ```

5. **Start the application**

   **Option 1: Using startup scripts**
   ```bash
   chmod +x SUPER-FAST-START.sh
   ./SUPER-FAST-START.sh
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Start Backend
   cd server
   node index.js
   
   # Terminal 2 - Start Frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 👥 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@hospital.com | doctorpass123 |
| Admin | admin@hospital.com | adminpass123 |
| Reports | reports@hospital.com | reportspass123 |
| Pharmacist | pharmacist@hospital.com | pharmacistpass123 |

⚠️ **Change these credentials in production!**

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Material-UI** for UI components
- **Axios** for API calls
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### AI Integration
- **Google Gemini AI** (gemini-2.5-flash)
- Generative AI SDK

## 📁 Project Structure

```
healthcare-prototype/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── api/              # API configuration
│   └── types/            # TypeScript types
├── server/                # Backend source code
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   └── index.js          # Server entry point
├── public/               # Static files
└── scripts/              # Utility scripts
```

## 🔧 Configuration

### Environment Variables

Create `server/.env` with the following:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/healthcare

# JWT
JWT_SECRET=your_secure_random_string

# Server
PORT=3001

# AI (Optional - for Alt-X feature)
GEMINI_API_KEY=your_gemini_api_key
```

### Get Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `server/.env`

## 🚀 Available Scripts

### Automatic Startup Scripts
- `./SUPER-FAST-START.sh` - Optimized development start
- `./INSTANT-START.sh` - Production mode
- `./SIMPLE-RESTART.sh` - Quick restart
- `./FIX-LOGIN-NOW.sh` - Complete app restart with fixes
- `./EMERGENCY-FIX.sh` - Emergency recovery

### Manual Commands
```bash
# Development mode
npm start                  # Start frontend (port 3000)
cd server && node index.js # Start backend (port 3001)

# Build for production
npm run build

# Run tests
npm test
```

## 🐛 Troubleshooting

### Login Issues
1. Ensure MongoDB is running: `brew services list` (macOS)
2. Check backend is running on port 3001
3. Run `./FIX-LOGIN-NOW.sh` for automatic fix

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Kill process on port 3001
lsof -ti :3001 | xargs kill -9
```

### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

### AI Assistant Not Working
1. Verify `GEMINI_API_KEY` in `server/.env`
2. Test connection: `node test-gemini-api.js`

## 📚 API Documentation

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Doctors
```
GET /api/doctors
GET /api/doctors/:id
POST /api/doctors
PUT /api/doctors/:id
DELETE /api/doctors/:id
```

### AI Assistant
```
POST /api/lumina-ai-gemini
```

### Users
```
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Environment variable protection
- CORS configuration
- Input validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for AI capabilities
- Material-UI for the component library
- MongoDB for database solutions

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation in the project

## 🚀 Deployment

### Deploy to Production

1. **Set environment to production**
   ```bash
   NODE_ENV=production
   ```

2. **Build frontend**
   ```bash
   npm run build
   ```

3. **Use production MongoDB**
   Update `MONGODB_URI` in `server/.env`

4. **Start with PM2 (recommended)**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name healthcare-api
   pm2 startup
   pm2 save
   ```

---

**Made with ❤️ for better healthcare management**

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
