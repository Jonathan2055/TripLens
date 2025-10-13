import pandas as pd
import os

# Define file paths
current_dir = os.path.dirname(os.path.abspath(__file__))
location = os.path.join(current_dir, '../docs/train.csv')
target_trip_dir = os.path.join(current_dir, '../docs/trip.csv')
target_location_dir = os.path.join(current_dir, '../docs/location.csv')



# Read only the required columns
trip = pd.read_csv(
    location,
    usecols=['id','vendor_id','pickup_datetime','dropoff_datetime','passenger_count','store_and_fwd_flag','trip_duration']
)

location = pd.read_csv(
    location,
    usecols=['pickup_longitude','pickup_latitude','dropoff_longitude','dropoff_latitude']
)

# Create new csv files from the read
trip.to_csv(target_trip_dir, index=False)
location.to_csv(target_location_dir, index=False)