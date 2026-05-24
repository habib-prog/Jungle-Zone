## Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Description

* `MONGODB_URI`
  MongoDB connection string used to connect the application to the database.

* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  Cloudinary cloud name from your Cloudinary dashboard.

* `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
  Unsigned upload preset used for client-side image uploads.

Do not commit your `.env.local` file to version control.

---

## Setup Guide

### MongoDB Setup

1. Go to https://www.mongodb.com/
2. Create a new cluster
3. Click "Connect" and choose "Drivers"
4. Copy the connection string
5. Replace the password and database name
6. Paste it into `MONGODB_URI`

---

### Cloudinary Setup

1. Go to https://cloudinary.com/
2. Create an account and log in
3. From the dashboard, copy your cloud name
4. Go to Settings → Upload → Upload presets
5. Create a new upload preset
6. Set signing mode to "Unsigned"
7. Save and copy the preset name
8. Add both values to your `.env.local` file

---

## Notes

* Image uploads are handled through Cloudinary
* The application uploads images first, then stores the returned URL in the database
* Ensure all environment variables are correctly set before running the project
