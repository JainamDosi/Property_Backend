# 🏡 Property Listing Backend

A fully-featured backend system for managing real estate property listings. Built with **Node.js**, **TypeScript**, **MongoDB**, and **Redis**, it supports:

- Property CRUD
- Advanced Filtering
- User Authentication
- Favorites
- Deployment Ready

---

## 🚀 Features

- ✅ Property CRUD (Create, Read, Update, Delete)
- 🔍 Advanced filtering on 10+ attributes
- 👤 User registration & login (email/password)
- ❤️ Favorite properties (add/remove/list)
- ⚡ Redis caching for optimized performance
- 🌐 Deployed via Render/Vercel 

---

## 📦 Tech Stack

| Tech           | Use Case                           |
|----------------|------------------------------------|
| **Node.js**    | Runtime                            |
| **TypeScript** | Type safety                        |
| **MongoDB**    | Database for users & properties    |
| **Redis**      | Caching layer                      |
| **Express**    | REST API framework                 |
| **JWT**        | Authentication                     |
| **Mongoose**   | ODM for MongoDB                    |

---

## 🔌 API Endpoints
## 👤 Authentication
| Method |	Endpoint| 	Description |
| -------| ---------| --------------|
POST |	/api/auth/register |	Register a new user |
POST |	/api/auth/login	| Login with credentials |

## 🏠 Properties
| Method	| Endpoint| 	Description |	Auth Required |
| ------- |---------|---------------|-------------|
GET	| /api/properties	| Get all properties with filters|	❌
GET	| /api/properties/:id	| Get a single property by ID	|❌
POST	| /api/properties	| Create a new property|	✅(Owner only)
PATCH	| /api/properties/:id	| Update property by ID	|✅ (Owner only)
DELETE	| /api/properties/:id	| Delete property by ID|	✅ (Owner only)

## ❤️ Favorites
| Method |	Endpoint | 	Description | 	Auth Required |
|--------| ----------| -------------| -----------------|
POST	| /api/favorites/|	Add property to favorites|	✅
DELETE	| /api/favorites/:propertyId |	Remove from favorites|	✅
GET 	|/api/favorites	|List user's favorites |	✅

