#  **TripLens API Documentation**

##  Overview

The **TripLens API** is a RESTful API built with [FastAPI](https://fastapi.tiangolo.com/) to manage and analyze **trip** and **vendor** data.
It provides endpoints to:

* Retrieve trip records (with pagination)
* Filter trips by month
* Retrieve vendor information with stats
* Get trip statistics such as total trips, average duration, and total passengers.

The data is stored in an SQLite database.

---

##  Base URL

```
http://localhost:8080
```

*(Adjust if deployed on a server)*

---

##  Technologies Used

* **FastAPI** — Web framework
* **SQLite** — Database
* **Uvicorn** — ASGI server
* **CORS Middleware** — For frontend access
* **Python 3.12+**

---

##  Database Structure (Required Tables)

### `trip` Table

| Column             | Type    | Description                    |
| ------------------ | ------- | ------------------------------ |
| id                 | INTEGER | Primary key                    |
| vendor_id          | INTEGER | Foreign key → `vendor.id`      |
| pickup_date        | TEXT    | Date and time trip started     |
| dropoff_date       | TEXT    | Date and time trip ended       |
| passenger_count    | INTEGER | Number of passengers           |
| location_id        | INTEGER | Foreign key → `location.id`    |
| store_and_fwd_flag | TEXT    | Flag (e.g. 'Y' or 'N')         |
| trip_duration      | REAL    | Duration in seconds or minutes |

### `vendor` Table

| Column      | Type    | Description        |
| ----------- | ------- | ------------------ |
| id          | INTEGER | Primary key        |
| name        | TEXT    | Vendor name        |
| description | TEXT    | Vendor description |

### `location` Table

| Column            | Type    | Description                |
| ----------------- | ------- | -------------------------- |
| id                | INTEGER | Primary key                |
| pickup_longitude  | REAL    | Longitude of pickup point  |
| pickup_latitude   | REAL    | Latitude of pickup point   |
| dropoff_longitude | REAL    | Longitude of dropoff point |
| dropoff_latitude  | REAL    | Latitude of dropoff point  |

---

##  Endpoints

### 1.  **Get All Trips**

```
GET /trip
```

#### Query Parameters

| Name  | Type | Required | Description                              |
| ----- | ---- | -------- | ---------------------------------------- |
| skip  | int  | No       | Number of records to skip (default 0)    |
| limit | int  | No       | Number of records to return (default 20) |

#### Response (200)

```json
{
  "total_trip": 320,
  "skip": 0,
  "limit": 20,
  "average_trip_duration": 785.5,
  "total_passenger": 1280,
  "data": [
    {
      "id": 1,
      "Vendor_name": "Vendor A",
      "pickup_date": "2025-10-01 08:00:00",
      "dropoff_date": "2025-10-01 08:30:00",
      "passenger_count": 3,
      "pickup_longitude": 29.123,
      "pickup_latitude": -1.945,
      "dropoff_longitude": 29.145,
      "dropoff_latitude": -1.955,
      "store_and_fwd_flag": "N",
      "trip_duration": 1800
    }
  ]
}
```

---

### 2.  **Get Trips by Month**

```
GET /trip/month/{month}
```

#### Path Parameters

| Name  | Type | Required | Description                      |
| ----- | ---- | -------- | -------------------------------- |
| month | int  | Yes      | Month number (e.g., 1 = January) |

#### Query Parameters

| Name  | Type | Required | Description       |
| ----- | ---- | -------- | ----------------- |
| skip  | int  | No       | Records to skip   |
| limit | int  | No       | Records to return |

#### Response (200)

```json
{
  "total_trip": 50,
  "skip": 0,
  "limit": 10,
  "month_name": "October",
  "average_trip_duration": 650.2,
  "total_passenger": 220,
  "data": [
    {
      "Trip_id": 101,
      "vendor_name": "Vendor B",
      "trip_pickup_date": "2025-10-05 09:00:00",
      "trip_dropoff_date": "2025-10-05 09:25:00",
      "trip_passenger_count": 2,
      "location_pickup_longitude": 29.100,
      "location_pickup_latitude": -1.950,
      "location_dropoff_longitude": 29.120,
      "location_dropoff_latitude": -1.940,
      "trip_store_and_fwd_flag": "N",
      "trip_trip_duration": 1500
    }
  ]
}
```

#### Errors

* `404 Not Found` — No trips found for that month
* `500 Internal Server Error` — Database or server issue

---

### 3.  **Get Single Trip by ID**

```
GET /trip/{id}
```

#### Path Parameters

| Name | Type | Required | Description                |
| ---- | ---- | -------- | -------------------------- |
| id   | str  | Yes      | ID of the trip to retrieve |

#### Response (200)

```json
{
  "id": 101,
  "vendor_name": "Vendor C",
  "trip_pickup_date": "2025-10-06 08:00:00",
  "trip_dropoff_date": "2025-10-06 08:40:00",
  "trip_passenger_count": 4,
  "location_pickup_longitude": 29.123,
  "location_pickup_latitude": -1.945,
  "location_dropoff_longitude": 29.145,
  "location_dropoff_latitude": -1.955,
  "trip_store_and_fwd_flag": "N",
  "trip_trip_duration": 2400
}
```

#### Errors

* `404 Not Found` — Trip not found

---

### 4.  **Get All Vendors**

```
GET /vendor
```

#### Response (200)

```json
[
  {
    "id": 1,
    "name": "Vendor A",
    "descrption": "Best service provider",
    "trip_count": 150,
    "average_trip_duration": 720.5,
    "total_passenger": 400
  },
  {
    "id": 2,
    "name": "Vendor B",
    "descrption": "Reliable transport",
    "trip_count": 180,
    "average_trip_duration": 680.0,
    "total_passenger": 560
  }
]
```

---

##  Error Handling

The API uses FastAPI's built-in `HTTPException` for structured error messages:

#### Example

```json
{
  "detail": "Trip with id: 999 not found"
}
```

| Code | Meaning               | When it occurs                |
| ---- | --------------------- | ----------------------------- |
| 404  | Not Found             | Trip or data doesn’t exist    |
| 500  | Internal Server Error | Database or server-side error |

---

## CORS Configuration

CORS is **fully open** in this code:

```python
allow_origins = ["*"]
```
For now we haven’t hosted our app, if we host it and get our domain we will restrict this to now receive request only from our site

---

##  Running the Server

1. **Install dependencies**

```bash
pip install fastapi uvicorn
```

2. **Run the API**

```bash
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

3. **Visit the documentation**

   * Swagger UI: [http://localhost:8080/docs](http://localhost:8080/docs)
   * ReDoc UI: [http://localhost:8080/redoc](http://localhost:8080/redoc)

---

## Example cURL Requests

**Get all trips**:

```bash
curl -X GET "http://localhost:8080/trip"
```

**Get trips by month**:

```bash
curl -X GET "http://localhost:8080/trip/month/10"
```

**Get trip by ID**:

```bash
curl -X GET "http://localhost:8080/trip/1"
```

**Get all vendors**:

```bash
curl -X GET "http://localhost:8080/vendor"
```

---

##  Future Improvements (Optional Ideas)

* Add `POST`, `PUT`, and `DELETE` endpoints for CRUD operations
* Add authentication and authorization (JWT)
* Improve error handling with detailed logs
* Use SQLAlchemy instead of raw SQLite for better scalability
* Implement unit tests with `pytest`


