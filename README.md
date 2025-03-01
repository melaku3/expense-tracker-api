# Expense Tracker API

A RESTful API built with Node.js, Express.js, and MongoDB that allows users to manage their expenses.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Authentication & Security](#authentication--security)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [Contact](#contact)

## Features
- User Authentication: Register and login with JWT-based authentication.
- CRUD Operations: Create, Read, Update, and Delete expense items.
- Filtering: Fetch expense items based on categories or date ranges.
- Security: Passwords are securely hashed, and users can access only their own data.

## Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT (jsonwebtoken) & bcrypt for password hashing
- Validation: Zod
- Error Handling: Centralized middleware

## Project Structure
```
expense-tracker-api/
│── src/
│   ├── controllers/        # Request handling logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   ├── middlewares/        # Authentication & validation
│   ├── utils/              # Utility functions
│   ├── config/             # Database & environment config
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Main entry point
│── .env                    # Environment variables
│── package.json
│── README.md
```

## Installation & Setup
### 1. Clone the repository
```sh
git clone https://github.com/melaku3/expense-tracker-api.git
cd expense-tracker-api
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and configure:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the server
```sh
npm start
```
The API will run at `http://localhost:3000`.

## API Documentation
### User Authentication
#### Register a New User
```http
POST /api/auth/signup
```
**Request Body (JSON):**
```json
{
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "securepassword"
}
```
**Response:**
```json
{
    "message": "User created successfully"
}
```

#### User Login
```http
POST /api/auth/login
```
**Request Body (JSON):**
```json
{
    "email": "johndoe@example.com",
    "password": "securepassword"
}
```
**Response:**
```json
{
    "message": "User logged in successfully"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
    "message": {
        "_id": "651234abcd",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "role": "user"
    }
}
```

### Expense Management
#### Create a New Expense
```http
POST /api/expenses
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Request Body (JSON):**
```json
{
    "categoryId": "651234abcd",
    "amount": 50,
    "description": "Grocery Shopping",
    "date": "2023-10-01"
}
```
**Response:**
```json
{
    "message": "Expense created successfully"
}
```

#### Get All Expenses
```http
GET /api/expenses
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
[
    {
        "_id": "651234abcd",
        "categoryId": {
            "_id": "651234abcd",
            "type": "expense",
            "name": "Grocery",
            "colorCode": "#ff0000",
            "description": "Grocery Shopping"
        },
        "amount": 50,
        "description": "Grocery Shopping",
        "date": "2023-10-01",
        "userId": {
            "_id": "651234abcd",
            "username": "johndoe",
            "email": "johndoe@example.com",
            "role": "user"
        }
    }
]
```

#### Get a Single Expense
```http
GET /api/expenses/:id
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
    "_id": "651234abcd",
    "categoryId": {
        "_id": "651234abcd",
        "type": "expense",
        "name": "Grocery",
        "colorCode": "#ff0000",
        "description": "Grocery Shopping"
    },
    "amount": 50,
    "description": "Grocery Shopping",
    "date": "2023-10-01",
    "userId": {
        "_id": "651234abcd",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "role": "user"
    }
}
```

#### Update an Expense
```http
PATCH /api/expenses/:id
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Request Body (JSON):**
```json
{
    "amount": 60
}
```
**Response:**
```json
{
    "message": "Expense updated successfully"
}
```

#### Delete an Expense
```http
DELETE /api/expenses/:id
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
    "message": "Expense deleted successfully"
}
```

#### Filter Expenses
```http
GET /api/expenses/filter
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Query Parameters:**
```
categoryId, minAmount, maxAmount, startDate, endDate, sortBy, limit, page
```
**Response:**
```json
[
    {
        "_id": "651234abcd",
        "categoryId": {
            "_id": "651234abcd",
            "type": "expense",
            "name": "Grocery",
            "colorCode": "#ff0000",
            "description": "Grocery Shopping"
        },
        "amount": 50,
        "description": "Grocery Shopping",
        "date": "2023-10-01",
        "userId": {
            "_id": "651234abcd",
            "username": "johndoe",
            "email": "johndoe@example.com",
            "role": "user"
        }
    }
]
```

### Category Management
#### Create a New Category
```http
POST /api/categories
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Request Body (JSON):**
```json
{
    "name": "Grocery",
    "type": "expense",
    "description": "Grocery Shopping",
    "colorCode": "#ff0000"
}
```
**Response:**
```json
{
    "message": "Category created successfully"
}
```

#### Get All Categories
```http
GET /api/categories
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
[
    {
        "_id": "651234abcd",
        "name": "Grocery",
        "type": "expense",
        "description": "Grocery Shopping",
        "colorCode": "#ff0000",
        "userId": {
            "_id": "651234abcd",
            "username": "johndoe",
            "email": "johndoe@example.com",
            "role": "user"
        }
    }
]
```

#### Get a Single Category
```http
GET /api/categories/:id
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
    "_id": "651234abcd",
    "name": "Grocery",
    "type": "expense",
    "description": "Grocery Shopping",
    "colorCode": "#ff0000",
    "userId": {
        "_id": "651234abcd",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "role": "user"
    }
}
```

#### Update a Category
```http
PATCH /api/categories/:id
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Request Body (JSON):**
```json
{
    "name": "Supermarket"
}
```
**Response:**
```json
{
    "message": "Category updated successfully"
}
```

#### Delete a Category
```http
DELETE /api/categories/:id
```
**Headers:**
```
Authorization: Bearer your_jwt_token
```
**Response:**
```json
{
    "message": "Category deleted successfully"
}
```

<!-- https://roadmap.sh/projects/expense-tracker-api -->

## Authentication & Security
- JWT Authentication: Users must include a valid JWT token in the Authorization header to access protected routes.
- Password Hashing: Uses bcrypt to securely hash passwords.
- Access Control: Users can only manage their own expenses.

## Error Handling
| Error Type                | Response Code | Example Message |
|---------------------------|--------------|----------------|
| Invalid Credentials       | 401          | "Invalid email or password" |
| Unauthorized Access       | 403          | "Access denied" |
| Resource Not Found        | 404          | "Expense not found" |
| Validation Error          | 400          | "Field is required" |
| Server Error              | 500          | "Internal server error" |

## Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## Contact
For any issues, feel free to reach out! 🚀  
Email: [emelaku63@gmail.com](mailto:emelaku63@gmail.com)  
GitHub: [melaku3](https://github.com/melaku3)
