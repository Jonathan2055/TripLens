CREATE DATABASE IF NOT EXISTS taxiapp;
USE taxiapp;
CREATE TABLE vendor(ID INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(100) NOT NULL, Description TEXT NOT NULL);
CREATE TABLE location(ID INT PRIMARY KEY AUTO_INCREMENT, Pickup_longitude DOUBLE NOT NULL, Pickup_latitude DOUBLE NOT NULL, Dropoff_longitude DOUBLE NOT NULL, Dropoff_latitude DOUBLE NOT NULL);
CREATE TABLE trip(ID VARCHAR(20) PRIMARY KEY, VendorID INT NOT NULL,Pickup_Date DATETIME NOT NULL, Dropoff_Date DATETIME NOT NULL, Passenger_Count INT NOT NULL, location_ID INT NOT NULL, Store_And_Fwd_Flag ENUM('Y','N') NOT NULL, Trip_Duration INT NOT NULL ,FOREIGN KEY (VendorID) REFERENCES vendor(ID), FOREIGN KEY (location_ID) REFERENCES location(ID));
INSERT INTO vendor (Name, Description) VALUES ('Yego Taxi', 'A popular taxi service in Rwanda'), ('SafeBoda', 'A leading motorcycle taxi service in East Africa');