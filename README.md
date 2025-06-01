# Property Backend API Documentation

This backend provides a RESTful API for managing property resources.

## Base URL

```
/api/properties
```

---

## Routes

### 1. Get All Properties

- **Endpoint:** `GET /api/properties`
- **Auth:** None
- **Description:** Retrieve a list of all properties.
- **Response:**  
  - `200 OK` – Array of property objects

---

### 2. Get Property By ID

- **Endpoint:** `GET /api/properties/:id`
- **Auth:** None
- **Description:** Retrieve a single property by its ID.
- **Params:**  
  - `id` (string) – Property ID
- **Response:**  
  - `200 OK` – Property object  
  - `404 Not Found` – If property does not exist

---

### 3. Create Property

- **Endpoint:** `POST /api/properties`
- **Auth:** Required (Bearer Token)
- **Description:** Create a new property.
- **Body:**  
  - JSON object with property details (see your model for required fields)
- **Response:**  
  - `201 Created` – Created property object  
  - `401 Unauthorized` – If token is missing/invalid

---

### 4. Update Property

- **Endpoint:** `PUT /api/properties/:id`
- **Auth:** Required (Bearer Token)
- **Description:** Update an existing property by ID.
- **Params:**  
  - `id` (string) – Property ID
- **Body:**  
  - JSON object with updated property fields
- **Response:**  
  - `200 OK` – Updated property object  
  - `401 Unauthorized` – If token is missing/invalid  
  - `404 Not Found` – If property does not exist

---

### 5. Delete Property

- **Endpoint:** `DELETE /api/properties/:id`
- **Auth:** Required (Bearer Token)
- **Description:** Delete a property by ID.
- **Params:**  
  - `id` (string) – Property ID
- **Response:**  
  - `200 OK` – Success message  
  - `401 Unauthorized` – If token is missing/invalid  
  - `404 Not Found` – If property does not exist

---

