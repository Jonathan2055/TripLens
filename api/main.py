from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os
import uvicorn
import math

app = FastAPI()

# Allow your frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

def name_of_months(n):
    if n =="01":
        return "January"
    elif n =="02":
        return "February"
    elif n =="03":
        return "March"
    elif n =="04":
        return "April"
    elif n =="05":
        return "May"
    elif n =="06":
        return "June"
    elif n =="07":
        return "July"
    elif n =="08":
        return "August"
    elif n =="09":
        return "September"
    elif n =="10":
        return "October"
    elif n =="11":
        return "November"
    elif n =="12":
        return "December"
    else:
        return "empty"

# location to SQLite DB
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "database", "triplens.db")

#select * from vendor
def get_all_vendor():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM vendor")
        rows = cursor.fetchall()
        conn.close()
        # Convert to list of dicts
        result = []
        for row in rows:
            result.append({
                "id": row[0],
                "name": row[1],
                "descrption": row[2]
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#select * from trip
def get_all_trip():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
                       SELECT 
                        trip.id, 
                        vendor.name,  
                        trip.pickup_date, 
                        trip.dropoff_date, 
                        trip.passenger_count, 
                        location.pickup_longitude, 
                        location.pickup_latitude, 
                        location.dropoff_longitude, 
                        location.dropoff_latitude, 
                        trip.store_and_fwd_flag, 
                        trip.trip_duration 
                        FROM trip 
                        INNER JOIN  vendor ON trip.vendor_id = vendor.id 
                        INNER JOIN  location ON trip.location_id = location.id 
                        LIMIT 20 ;
                       """)
        rows = cursor.fetchall()
        conn.close()
        # Convert to list of dicts
        result = []
        for row in rows:
            result.append({
                "id": row[0],
                "Vendor_name": row[1],
                "pickup_date": row[2],
                "dropoff_date": row[3],
                "passenger_count": row[4],
                "pickup_longitude": row[5],
                "pickup_latitude": row[6],
                "dropoff_longitude": row[7],
                "dropoff_latitude": row[8],
                "store_and_fwd_flag": row[9],
                "trip_duration": row[10]                
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# select single location by id
def get_trip_by_id(id :str):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
                       SELECT  
                        trip.id, 
                        vendor.name,   
                        trip.pickup_date, 
                        trip.dropoff_date, 
                        trip.passenger_count, 
                        location.pickup_longitude, 
                        location.pickup_latitude, 
                        location.dropoff_longitude, 
                        location.dropoff_latitude, 
                        trip.store_and_fwd_flag, 
                        trip.trip_duration 
                        FROM trip 
                        INNER JOIN  vendor ON trip.vendor_id = vendor.id 
                        INNER JOIN  location ON trip.location_id = location.id 
                       WHERE trip.id = ?
                       """, (id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {
                "id": row[0],
                "vendor_name": row[1],
                "trip_pickup_date": row[2],
                "trip_dropoff_date": row[3],
                "trip_passenger_count": row[4],
                "location_pickup_longitude": row[5],
                "location_pickup_latitude": row[6],
                "location_dropoff_longitude": row[7],
                "location_dropoff_latitude": row[8],
                "trip_store_and_fwd_flag": row[9],
                "trip_trip_duration": row[10]

            }
        else:
            raise HTTPException(status_code=404, detail=f"Trip with id: {id}, not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_trip_by_month(month: int):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        month = f"{month:2d}"  # Format month as two digits
        
        cursor.execute("""
                       SELECT  
                        trip.id, 
                        vendor.name,   
                        trip.pickup_date, 
                        trip.dropoff_date, 
                        trip.passenger_count, 
                        location.pickup_longitude, 
                        location.pickup_latitude, 
                        location.dropoff_longitude, 
                        location.dropoff_latitude, 
                        trip.store_and_fwd_flag, 
                        trip.trip_duration 
                        FROM trip 
                        INNER JOIN  vendor ON trip.vendor_id = vendor.id 
                        INNER JOIN  location ON trip.location_id = location.id 
                        WHERE strftime('%m', trip.pickup_date) = ?
                        LIMIT 10;
        """, (month))
        row = cursor.fetchall()
        conn.close()
        if row:
            json = {name_of_months(month) : []}
            for i in row:
                id = i[0]
                vendor_name = i[1]
                trip_pickup_date = i[2]
                trip_dropoff_date = i[3]
                trip_passenger_count = i[4]
                location_pickup_longitude = i[5]
                location_pickup_latitude = i[6]
                location_dropoff_longitude = i[7]
                location_dropoff_latitude = i[8]
                trip_store_and_fwd_flag = i[9]
                trip_trip_duration = i[10]
                json[name_of_months(month)].append({
                    "Trip_id":id,
                    "vendor_name": vendor_name,
                    "trip_pickup_date": trip_pickup_date,
                    "trip_dropoff_date": trip_dropoff_date,
                    "trip_passenger_count": trip_passenger_count,
                    "location_pickup_longitude": location_pickup_longitude,
                    "location_pickup_latitude": location_pickup_latitude,
                    "location_dropoff_longitude": location_dropoff_longitude,
                    "location_dropoff_latitude": location_dropoff_latitude,
                    "trip_store_and_fwd_flag": trip_store_and_fwd_flag,
                    "trip_trip_duration": trip_trip_duration
                })
            return json
        else:
            raise HTTPException(status_code=404, detail=f"No trips where made this month")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





# API endpoint to get a trip by id
@app.get("/trip/{id}")
def read_trip(id:str):
    return get_trip_by_id(id)

# API endpoint to get all trip
@app.get("/trip")
def read_trip():
    return get_all_trip()

# API endpoint to get all trip by months
@app.get("/trip/month/{month}")
def read_trip_by_month(month: int):
    return get_trip_by_month(month)


if __name__ == "__main__":
    port = 8080
    print(f"🚀 FastAPI server running at http://0.0.0.0:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

