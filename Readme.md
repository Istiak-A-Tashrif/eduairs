
# Eduairs

This is simnple project where as backend we have laravel and React as frontend. The authenctication system and secuiring API is done by Laravel Sanctum. We have Role Based Access Controll (Admin and User). RBAC done by Spatie Laravel-Permission. And a simple product CRUD operattion. 

Users can only view the Product and Admin has all the credibility. Admin can update users role.

* **Admin Crediantials:** Email: admin@example.com, Password: 123456
* **User Crediantials:** Email: user@example.com, Password: 123456


## Features

- Authentication
- RBAC
- Simple Product Module
- SPA (React)


## Tech Stack

**Client:** React, React Router, TypeScript, Context API, TailwindCSS

**Server:** Laravel, Laravel Sanctum, Spatie Laravel-Permission

**Database:** MySQL

## API Reference

You will find a **Postman Collection** in the `backend` folder or the root folder of the Laravel project. You can import it into Postman to test the API endpoints.

### **Create Admin**  
This command creates a new admin with the provided name, email, and password.

```bash
php artisan create:admin {name} {email} {password}
```
Example
```bash
php artisan create:admin "John Doe" "john.doe@example.com" "password123"
```
### **Create User**  
This command creates a new user with the provided name, email, and password.

```bash
php artisan create:user {name} {email} {password}
```
Example
```bash
php artisan create:user "John Doe" "john.doe@example.com" "password123"
```
## Installation

Backend Setup

```bash
  cd backend
  cp .env.example .env
  composer install
  php artisan key:generate
  php artisan migrate --seed
```
Setup website (frontend) with npm

```bash
  cd website
  cp .env.example .env.local
  npm install
```
    
## Environment Variables

To run this project, you will need to add/update the following environment variables to your .env file

- Backend 

`FRONTEND_URL`

`DB_DATABASE`

- Website

`VITE_API_URL`

## Running Locally


To run the backend, You can simply use Herd, Laragon, XAMPP or WAMP any of the local development environment. Or can just simply use `php artisan serve` and update the .env files accordingly.

To run the website, execute the following command

```bash
  cd website
  npm run dev
```

