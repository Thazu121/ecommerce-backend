# 🛒 E-Commerce Backend API (Node.js + Express + MongoDB)

## 📌 Project Overview

This project is a complete backend system for an e-commerce application. It includes authentication, role-based access control, product management, order management, and a recommendation system.

---

## 🚀 Features

### 🔐 Authentication

* User Registration
* User Login (JWT-based authentication)
* Password hashing using bcrypt

### 👤 User Profile

* Get Profile
* Update Profile

### 🛍️ Product Management

* Create Product (Admin only)
* Get All Products
* Get Single Product
* Update Product (Admin only)
* Delete Product (Admin only)
* Filter & Search Products

### 📦 Order Management

* Create Order
* Get My Orders
* Get All Orders (Admin only)
* Update Order Status (Admin only)



### 🤖 Recommendation System

* Suggest products based on user order history
* Uses category-based filtering
* Fallback to random products if no order history

---

## 🧠 Technologies Used

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (Authentication)
* bcryptjs (Password hashing)

---

## 🔑 Authentication Flow

1. Register user
2. Login user
3. Receive JWT token
4. Use token in headers:

```
Authorization: Bearer <token>
```

---

## 🧱 Project Structure

```
project/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── config/
├── index.js
```

---

## 📡 API Endpoints

### 🔐 Auth

* POST `/register`
* POST `/login`

### 👤 User

* GET `/user/profile`
* PUT `/user/profile`

### 🛍️ Products

* GET `/products`
* GET `/products/:id`
* POST `/products` (Admin)
* PUT `/products/:id` (Admin)
* DELETE `/products/:id` (Admin)
* GET `/products/filter/search`

### 📦 Orders

* POST `/order`
* GET `/order/my`
* GET `/order` (Admin)
* PUT `/order/:id` (Admin)


### 🤖 Recommendation

* GET `/analytics/recommendation`

---

## 🛡️ Middleware

* **authMiddleware** → verifies JWT
* **roleMiddleware** → restricts access by role

---

## 🧠 Recommendation Logic

* Fetch user orders
* Extract product categories
* Find similar category products
* Remove duplicates
* Limit results

---


## ⚙️ Setup Instructions

1. Clone the repository
2. Install dependencies:

```
npm install
```

3. Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

4. Run the server:

```
npm run dev
```

---

## 🧪 Testing

Use Postman to test APIs:

* Register → Login → Copy Token
* Add token in headers
* Test protected routes

---

## 🏆 Conclusion

This project demonstrates:

* Backend architecture
* Authentication & Authorization
* REST API design
* MongoDB operations
* Basic recommendation system


