import pandas as pd

# Read only the required columns
trip = pd.read_csv(
    '/docs/train.csv',
    usecols=['id','vendor_id','pickup_datetime','dropoff_datetime','passenger_count','store_and_fwd_flag','trip_duration']
)

location = pd.read_csv(
    'train.csv',
    usecols=['pickup_longitude','pickup_latitude','dropoff_longitude','dropoff_latitude']
)

# Create new csv files from the read
trip.to_csv('/docs/trip.csv', index=False)
location.to_csv('/docs/location.csv', index=False)