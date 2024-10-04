# API Documentation for Auth Service

=====================================

### Auth service API

#### Table of Contents

1.  [Pre-Requisites](#pre-requisites)
2.  [How to Run](#how-to-run)
3.  [Local Authentication](#create-slot)
4.  [OAuth](#delete-slot)
5.  [Password Operations](#delete-slot)
6.  [Local register send OTP](#local-register-send-OTP)
7.  [Local register verify OTP](#local-register-verify-OTP)
8.  [Local register confirm password](#local-register-confirm-password)
9.  [Local Login confirm password](#local-login-confirm-password)
10. [Local SSO send OTP](#local-SSO-send-OTP)
11. [Local SSO verify OTP](#local-SSO-verify-OTP)
12. [Google OAuth](#Google-OAuth)
13. [Forget Password](#forget-password)
14. [Reset Password](#reset-password)
15. [Change Password](#change-password)

### Pre-requisites

---

- You must have the [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/) and [POSTMAN](https://www.postman.com/) to run this API.

### How to run

---

1. Clone the repository

```bash
git clone -b slot-service/before-tests https://github.com/vtalix/slot-service.git
```

2. Install the dependencies

```bash
cd auth-service/src
npm install
npm start
```

### Local Authentication

---

Local Authentication invloves our new user to enter there email or phone for registering.

Followed by submitting the OTP that would be sent to them via Email or SMS.

After that they enter and confirm there password for User registration.

They can later login using the email or phone they registered and the password they saved

SSO Authentication involves users to authenticate themselves with the email of there organisation which will be saved beforehand in our database

They need to enter the OTP which will be sent to them via Email for using the application.

### Open Authentication

---

Open authentication invloves our user to login via there Google account, there google_id will be saved in our database

### Password operations

---

These include Reset or Changing Password by the User,

The user will be able to reset there password by following a link sent to there email or SMS where they will enter there new password which will be different than the previous password.
The user can only change there password when they are logged in

<!-- main endpoint for accessing auth api -->

## Main Endpoint

```bash
/auth
```

### Local register send OTP

- Endpoint:

```bash
/local/register/send-otp
```

- #### Method: POST
- Description: This endpoint allows a user to register with there Email or Phone and get an OTP which will be used for further verification.

#### Request Body JSON 1

```json
{
  "email": "hardiksingh467@gmail.com"
}
```

#### Request Body JSON 2

```json
{
  "phone": "+918949487677"
}
```

#### Response JSON 1

```json
{
  "message": "Email sent successfully"
}
```

#### Response JSON 2

```json
{
  "message": "SMS sent successfully"
}
```

### Local register verify OTP

- Endpoint:

```bash
/local/register/validate-otp
```

- #### Method: POST
- Description: This endpoint allows a user to register with there Email or Phone and send the OTP which will be used for verifying that the account is being created with users permission.

#### Request Body JSON 1

```json
{
  "otp": "232980",
  "email": "hardiksingh467@gmail.com"
}
```

#### Request Body JSON 2

```json
{
  "otp": "727104",
  "phone": "+918949487677"
}
```

#### Response JSON 1

```json
{
  "success": true,
  "message": "User verified",
  "verified": true
}
```

#### Response JSON 2

```json
{
  "success": true,
  "message": "User verified",
  "verified": true
}
```

### Local register confirm password

- Endpoint:

```bash
/local/register/create-user
```

- #### Method: POST
- Description: This endpoint allows a user to register with there Email or Phone and confirm there newly set password which will be used for future authentication.

#### Request Body JSON 1

```json
{
  "email": "hardiksingh467@gmail.com",
  "phone": null,
  "password": "123456789",
  "confirmPassword": "123456789"
}
```

#### Request Body JSON 2

```json
{
  "email": null,
  "phone": "+918949487677",
  "password": "123456789",
  "confirmPassword": "123456789",
  "role": "doctor"
}
```

#### Response JSON 1

```json
{
  "message": "User created and Logged In",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmY4YThmMDY0OGRmZTRkOWFhZmMxYyIsImlhdCI6MTcyODAyMzE4MywiZXhwIjoxNzI4MTA5NTgzfQ.0t719lnk7yrGU7oix-4SRAs54bg7O_Lz6OtAQJvGvwo"
}
```

#### Response JSON 2

```json
{
  "message": "User created and Logged In",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmY4OWI2MDY0OGRmZTRkOWFhZmMwYSIsImlhdCI6MTcyODAyMjk2NiwiZXhwIjoxNzI4MTA5MzY2fQ.cAybH8XlJPqILia9LM3B-Xuank-50mwZm6jyCkqvRps"
}
```

### Local Login confirm password

- Endpoint:

```bash
/local/login
```

- #### Method: POST
- Description: This endpoint allows a user to login with there Email or Phone and password a token will be generated for them.

#### Request Body JSON 1

```json
{
  "password": "123456789",
  "email": "kumar.anshul@vtalix.in"
}
```

#### Request Body JSON 2

```json
{
  "password": "123456789",
  "phone": "+918949487677"
}
```

#### Response JSON 1

```json
{
  "message": "Login Confirmed",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmY4YTMyMDY0OGRmZTRkOWFhZmMxMyIsImlhdCI6MTcyODA0NDA1MCwiZXhwIjoxNzI4MTMwNDUwfQ.gQ7wPb4o7uFC0ncinhAf9Zk_cZD_8lptQDIgGKiLa70"
}
```

#### Response JSON 2

```json
{
  "message": "Login Confirmed",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmY4OWI2MDY0OGRmZTRkOWFhZmMwYSIsImlhdCI6MTcyODA0NDA2MSwiZXhwIjoxNzI4MTMwNDYxfQ.LEMAyJM59tmEefv_-YJUXaOa6OQzbb10159EJeQZXXU"
}
```

### Local SSO send OTP

- Endpoint:

```bash
/local/sso/send-otp
```

- #### Method: POST
- Description: This endpoint allows a user to login with there Organization Email an OTP will be genrated for them for further verification.

#### Request Body JSON

```json
{
  "email": "singh.hardik@vtalix.in"
}
```

#### Response JSON

```json
{
  "message": "Email sent successfully"
}
```

### Local SSO verify OTP

- Endpoint:

```bash
/local/sso/verify-otp
```

- #### Method: POST
- Description: This endpoint allows a user to login with there Organization Email and OTP , this will generate a token.

#### Request Body JSON

```json
{
  "email": "singh.hardik@vtalix.in",
  "otp": "779344"
}
```

#### Response JSON

```json
{
  "message": "User Verified",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZmY4OWI2MDY0OGRmZTRkOWFhZmMwYSIsImlhdCI6MTcyODA0NDA2MSwiZXhwIjoxNzI4MTMwNDYxfQ.LEMAyJM59tmEefv_-YJUXaOa6OQzbb10159EJeQZXXU"
}
```

### Google OAuth

- Endpoint:

```bash
/oauth/google
```

- #### Method: POST
- Description: This endpoint allows a user to login with there Gmail , this will take the user to Sign In with Google Page.

#### Request JSON

```json
{
  "token": "ya29.a0AfH6SMBExampleTokenXyZ", // Google ID token received from frontend
  "provider": "google" // Specify provider, useful in multi-auth setups
}
```

#### Response JSON

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "6349a73e9a5b2c1f8e7d1234", // Your app's user ID
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "profile_picture": "https://lh3.googleusercontent.com/a-/AOh14GhExample",
    "google_id": "102938475625189237459", // Google User ID
    "role": "user" // Could be 'admin', 'user', etc. based on your app logic
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eXampleJWT" // Your JWT for authenticated requests
}
```

### Forget Password

- Endpoint:

```bash
/password/forget-password
```

- #### Method: POST
- Description: This endpoint allows a user to reset there password if they have forgotten it.

#### Request Body JSON

```json
{
  "email": "singh.hardik@vtalix.in"
}
```

#### Response JSON

```json
{
  "success": true,
  "message": "Email or SMS sent"
}
```

### Reset Password

- Endpoint:

```bash
/password/reset-password
```

- #### Method: POST
- Description: This endpoint allows a user to change there password with new password

#### Request Body JSON

```json
{
  "new_password": "123456789",
  "confirm_password": "123456789"
}
```

#### Response JSON

```json
{
  "success": true,
  "message": "password changed successfully please login"
}
```

### Change Password

- Endpoint:

```bash
/password/reset-password
```

- #### Method: POST
- Description: This endpoint allows a user to change there password
- #### Authentication: Required (Doctor only) - JWT Bearer Token

#### Request Body JSON

```json
{
  "currentPassword": "987654321",
  "newPassword": "hardik123",
  "confirmPassword": "hardik123"
}
```

#### Response JSON

```json
{
  "success": true,
  "message": "password changed successfully"
}
```
