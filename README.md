# Ride-Hailing-Project-x
Ride hailing application

# MobilityX
Ride Hailing System Backend core built in Nodejs and TypeScript
MobX is a ride hailing service with features such as: authentication, ride request management, and role-based access (rider, driver). Built using TypeScript, Node.js, Express, and MongoDB.

## Tech Stack
- TypeScript
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for Auth
- bcrypt for password hashing
- Helmet, cors, dotenv, morgan

## General Features
- Two roles: Driver and Rider. Riders can request rides, and drivers can accept and complete rides.
- User registration/login (rider, driver roles)
- Request a ride (pickup/dropoff)
- Driver views pending rides
- Accept/start/complete rides
- View ride history

## Attribute Features:
- Authentication: 
User signup/login (role: rider, driver)
JWT token issuance
Role-based access control

- Ride Flow
Rider creates a ride request (pickup, dropoff)
Driver sees a list of pending requests
Driver accepts a ride → status: accepted
Driver marks ride as in_progress then completed

- Trip History
Rider: List of past-trips
Driver: List of trips served

