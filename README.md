# CodeCopilot - AI-Powered Code Generation Platform

A full-stack web application that enables users to generate high-quality code in multiple programming languages using AI. Built with React and Node.js, featuring a beautiful UI, user authentication, and comprehensive history management with pagination.

## 🌟 Features

- **AI Code Generation**: Generate code in JavaScript, Python, C++, and Java using natural language prompts powered by Google Gemini AI
- **Syntax Highlighting**: Beautiful code presentation with syntax highlighting using react-syntax-highlighter
- **User Authentication**: Secure signup and login system with JWT tokens and bcrypt password hashing
- **Paginated History**: View all your previous generations with server-side pagination
- **Copy to Clipboard**: Easily copy generated code with one click
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Theme Toggle**: Switch between dark and light modes
- **Real-time Feedback**: Loading states, error handling, and success notifications

## 🚀 Live Demo

- **Frontend**: [Deployed URL here]
- **Backend API**: [Deployed API URL here]

**Demo Credentials:**
```
Email: demo@codecopilot.com
Password: Demo@123
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Database (local or hosted - Aiven/PlanetScale/Railway)
- Google Gemini AI API Key ([Get it here](https://makersuite.google.com/app/apikey))

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** with Express - Server framework
- **Prisma ORM** - Database ORM with type safety
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Google Gemini AI** - Code generation API
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📂 Project Structure

```
AutomationEdge/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── GeneratorPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── prisma.config.ts
    ├── controller/
    │   ├── userController.js
    │   └── AiController.js
    ├── route/
    │   ├── userRoute.js
    │   └── codeGeneratorRoute.js
    ├── middleware/
    │   └── verifyPassword.js
    ├── AiModal/
    │   └── geminiAi.js
    ├── lib/
    │   └── prisma.js
    ├── .env.example
    └── index.js
```

## 🗄️ Database Schema

### Tables Overview

#### 1. User Table
Stores user account information for authentication and generation ownership.

| Column     | Type         | Constraints                    | Description                |
|------------|--------------|--------------------------------|----------------------------|
| id         | INTEGER      | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier     |
| email      | VARCHAR(191) | UNIQUE, NOT NULL               | User's email (login ID)    |
| name       | VARCHAR(191) | NOT NULL                       | User's display name        |
| password   | VARCHAR(191) | NOT NULL                       | Bcrypt hashed password     |
| createdAt  | DATETIME(3)  | DEFAULT CURRENT_TIMESTAMP      | Account creation timestamp |

#### 2. Generation Table
Stores all AI-generated code snippets with metadata.

| Column    | Type         | Constraints                    | Description                    |
|-----------|--------------|--------------------------------|--------------------------------|
| id        | INTEGER      | PRIMARY KEY, AUTO_INCREMENT    | Unique generation identifier   |
| prompt    | VARCHAR(191) | NOT NULL                       | User's input prompt            |
| language  | ENUM         | NOT NULL                       | Target language (js/py/cpp/java)|
| code      | LONGTEXT     | NOT NULL                       | AI-generated code              |
| timestamp | DATETIME(3)  | DEFAULT CURRENT_TIMESTAMP      | Generation creation time       |
| userId    | INTEGER      | FOREIGN KEY → User(id), NOT NULL| Owner of the generation       |

**Indexes:**
- `Generation_timestamp_idx` on `timestamp` (for sorting in pagination)
- `Generation_userId_idx` on `userId` (for filtering user generations)

### Entity Relationship

**Relationship Type:** One-to-Many (User → Generation)

- One User can have many Generations (0..*)
- Each Generation belongs to exactly one User (1)
- **Foreign Key Constraint:** `Generation.userId` references `User.id`
  - `ON DELETE RESTRICT` - Prevents user deletion if they have generations
  - `ON UPDATE CASCADE` - Updates userId if user id changes

### Schema Design Decisions

1. **Foreign Key Constraint (`userId` → `User.id`):**
   - Ensures referential integrity
   - Prevents orphaned generations
   - Maintains data consistency
   - Database enforces the relationship

2. **Indexes:**
   - **`timestamp` index:** Optimizes `ORDER BY timestamp DESC` queries for pagination
   - **`userId` index:** Speeds up `WHERE userId = ?` filtering
   - Both indexes are composite-friendly for `WHERE userId = ? ORDER BY timestamp DESC`

3. **Enum for Language:**
   - Prevents invalid language values at database level
   - Improves data integrity
   - Type-safe queries
   - Better than CHECK constraint or application-level validation

4. **LONGTEXT for Code:**
   - Supports large code snippets (up to 4GB)
   - Prevents truncation of complex algorithms
   - No VARCHAR(255) limitations

5. **Timestamps with Millisecond Precision:**
   - DATETIME(3) provides microsecond accuracy
   - Useful for precise ordering and debugging
   - Auto-populated on creation

## 📊 ER Diagram

```
┌────────────────────────────┐                    ┌──────────────────────────────┐
│          User              │                    │        Generation            │
├────────────────────────────┤                    ├──────────────────────────────┤
│ PK  id (INT, AI)           │                    │ PK  id (INT, AI)             │
│     email (VARCHAR, UQ)    │◄───────────────────│ FK  userId (INT, NN)         │
│     name (VARCHAR)         │        1:N         │     prompt (VARCHAR)         │
│     password (VARCHAR)     │                    │     language (ENUM)          │
│     createdAt (DATETIME)   │                    │     code (LONGTEXT)          │
└────────────────────────────┘                    │     timestamp (DATETIME)     │
                                                  └──────────────────────────────┘
                                                  
                                                  Indexes:
                                                  ├─ IDX: timestamp
                                                  └─ IDX: userId

Legend:
  PK = Primary Key
  FK = Foreign Key  
  UQ = Unique Constraint
  NN = Not Null
  AI = Auto Increment

Relationship Details:
  - One User → Many Generations (1:N)
  - ON DELETE RESTRICT: Cannot delete user with existing generations
  - ON UPDATE CASCADE: UserId updates cascade to generations
  - Indexed columns optimize query performance for pagination and filtering
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vivekr077/AutomationEdge.git
cd AutomationEdge
```

### 2. Backend Setup

Navigate to backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (refer to `.env.example`):

```env
PORT=3000

# MySQL Database Configuration (Aiven/PlanetScale/Local)
DATABASE_URL="mysql://username:password@host:port/database_name"
DATABASE_USER="your_db_username"
DATABASE_PASSWORD="your_db_password"
DATABASE_NAME="your_database_name"
DATABASE_HOST="your_db_host"
DATABASE_PORT=3306

# Authentication
SALT=10
JWT_KEY="your-super-secret-jwt-key-change-this"

# Google Gemini AI API Key
# Get it from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your-gemini-api-key-here"
```

**Where to Get API Keys:**
- **Gemini API Key:** Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- **MySQL Database (Aiven):** 
  1. Sign up at [Aiven.io](https://aiven.io/)
  2. Create a MySQL service (free tier available)
  3. Copy connection details to .env file

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:

```bash
npm start
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal, navigate to frontend directory:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173` (Vite default) or `http://localhost:5174`

### 4. Verify Setup

1. Open browser and go to `http://localhost:5173`
2. Click "Get Started" to create an account
3. After signup, test code generation
4. Check history page for saved generations

## 🔑 Required API Keys & Credentials

### Google Gemini AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and paste in `.env` as `GEMINI_API_KEY`

### MySQL Database Setup (Aiven - Free Tier)
1. Sign up at [Aiven.io](https://aiven.io/)
2. Create new MySQL service
3. Select free tier (1 CPU, 1GB RAM)
4. Wait for service to start (2-3 minutes)
5. Copy these values to `.env`:
   - **Host:** Service URI host
   - **Port:** Usually 19595 for Aiven
   - **Username:** Default is `avnadmin`
   - **Password:** Auto-generated, copy from dashboard
   - **Database Name:** Usually `defaultdb`
   
6. Construct `DATABASE_URL`:
   ```
   mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED
   ```

### JWT Secret Key
Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Use output as `JWT_KEY` in `.env`


## 📈 Performance & Complexity Analysis

### Time Complexity of Paginated History Retrieval

**Query Executed:**
```sql
SELECT * FROM Generation 
WHERE userId = ? 
ORDER BY timestamp DESC 
LIMIT ? OFFSET ?
```

**Complexity Breakdown:**

1. **WHERE Clause (userId filter):**
   - With Index: **O(log n)** - Binary search on B-tree index
   - Without Index: O(n) - Full table scan
   
2. **ORDER BY (timestamp sorting):**
   - With Index: **O(1)** - Index already sorted
   - Without Index: O(k log k) where k = filtered results
   
3. **LIMIT/OFFSET:**
   - **O(1)** - Constant time to return k records
   - Offset penalty: O(offset) to skip records (negligible for small pages)

**Overall Time Complexity:**
- **With Indexes (our implementation):** **O(log n + k)**
  - O(log n) to find userId range
  - O(k) to return k records
  - Where n = total generations, k = page size (10)
  
- **Without Indexes:** O(n log n)
  - Full table scan + sorting

**Space Complexity:** O(k) where k = page size (10 records)

### How Schema Affects Query Performance

**Positive Impacts:**

1. **Indexed Foreign Key (userId):**
   - Speeds up `WHERE userId = ?` filtering
   - Avoids full table scans
   - Reduces query time from O(n) to O(log n)

2. **Indexed Timestamp:**
   - Enables fast sorting without in-memory sort
   - `ORDER BY timestamp DESC` uses index directly
   - Critical for pagination performance

3. **Composite Index Opportunity:**
   - MySQL can use both indexes together
   - `WHERE userId = ? ORDER BY timestamp DESC` optimized
   - Single index scan satisfies both conditions

4. **Normalized Schema:**
   - Smaller Generation table (no redundant user data)
   - Faster scans, better cache locality
   - Efficient joins when needed

**Query Flexibility:**

1. **User-Specific Queries:**
   ```sql
   SELECT * FROM Generation WHERE userId = ? ORDER BY timestamp DESC;
   ```
   Fast due to userId index

2. **Recent Generations (All Users):**
   ```sql
   SELECT * FROM Generation ORDER BY timestamp DESC LIMIT 10;
   ```
   Fast due to timestamp index

3. **Language Filtering:**
   ```sql
   SELECT * FROM Generation WHERE userId = ? AND language = 'python';
   ```
   Can benefit from composite index (userId, language)

4. **Date Range Queries:**
   ```sql
   SELECT * FROM Generation 
   WHERE userId = ? AND timestamp BETWEEN ? AND ?;
   ```
   Efficient range scan on indexed timestamp

```
Email: demo@gmail.com
Password: demo@123
```

Create a `.env` file in the `backend/` directory with these variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port number | `3000` |
| `DATABASE_URL` | Yes | Full MySQL connection string | `mysql://user:pass@host:port/db` |
| `DATABASE_USER` | Yes | MySQL username | `avnadmin` |
| `DATABASE_PASSWORD` | Yes | MySQL password | `your_db_password` |
| `DATABASE_NAME` | Yes | Database name | `defaultdb` or `codecopilot` |
| `DATABASE_HOST` | Yes | Database host URL | `yourhost.aivencloud.com` |
| `DATABASE_PORT` | Yes | Database port | `3306` (local) or `19595` (Aiven) |
| `SALT` | Yes | Bcrypt salt rounds | `10` (recommended) |
| `JWT_KEY` | Yes | Secret key for JWT signing | `your-super-secret-key` |
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key | `AIza...` |

**Complete .env Example:**
```env
PORT=3000

# Aiven MySQL Configuration (Free Tier)
DATABASE_URL="mysql://avnadmin:AVNS_abc123@mydb.aivencloud.com:19595/defaultdb?ssl-mode=REQUIRED"
DATABASE_USER="avnadmin"
DATABASE_PASSWORD="AVNS_abc123xyz456"
DATABASE_NAME="defaultdb"
DATABASE_HOST="mydb-project.c.aivencloud.com"
DATABASE_PORT=19595

# Security
SALT=10
JWT_KEY="generate-with-crypto-randomBytes-32-hex"

# AI API
GEMINI_API_KEY="AIzaSyC..."
```

**Frontend Environment Variables:**

No environment variables needed for local development. 

For production deployment, update the API base URL in:
```javascript
// frontend/src/utils/api.js
const api = axios.create({
  baseURL: 'https://your-backend-api.com/api/v1',  // Update this
  withCredentials: true,
});
```

## 👨‍💻 Author

**Vivek**
- GitHub: [@vivekr077](https://github.com/vivekr077)
- Email: vivekranjan0821@gmail.com

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the code generation
- **Prisma** for the excellent ORM and type-safety
- **Aiven** for free-tier MySQL hosting
- **React** and **Vite** communities for amazing tools
- **Lucide Icons** for beautiful icon library

**Built with ❤️ and ☕ for developers, by a developer.**

*Assignment Project - Code Generation Copilot*

