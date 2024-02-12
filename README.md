
# YouTube Backend

Welcome to the YouTube Backend project! This backend system provides a comprehensive set of functionalities similar to YouTube, including authentication, authorization, video management, playlists, comments, subscriptions, and user management. It also integrates with Cloudinary for video and thumbnail storage.

## Features

- **Authentication**: User authentication using JWT tokens.
- **Authorization**: Role-based access control to restrict endpoints.
- **Video Management**: CRUD operations for uploading, updating, and deleting videos.
- **Playlists**: Create, update, delete playlists, and add videos to playlists.
- **Comments**: Add, edit, and delete comments on videos.
- **Subscriptions**: Allow users to subscribe to channels and receive notifications.
- **User Management**: CRUD operations for managing user accounts.

## Technologies Used

- **Node.js**: Backend server environment.
- **Express.js**: Web framework for routing and middleware.
- **MongoDB**: Database for storing user data, videos, comments, etc.
- **Cloudinary**: Cloud storage for video files and thumbnails.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt**: Password hashing for user security.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="nodejs" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="expressjs" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="mongodb" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JsonWebToken" />
  <img src="https://img.shields.io/badge/Cloudinary-339933?style=for-the-badge&logo=Cloudinary&logoColor=white" alt="Cloudinary"/>
</p>

## Setup

1. **Clone the repository**: `git clone https://github.com/Krshnna/Youtube-backend-clone.git`
2. **Install dependencies**: `npm install`
3. **Configure environment variables**: Set up environment variables for MongoDB connection, Cloudinary API keys, etc.
4. **Run the server**: `npm run dev`

## API Documentation

The backend provides a RESTful API for interacting with various resources. Below are the main endpoints:

- **Authentication**:
  - `POST /api/v1/users/login`: Login with username and password.
  - `POST /api/v1/users/register`: Register a new user.

- **Videos**:
  - `GET /api/v1/videos`: Get all videos.
  - `GET /api/v1/videos/:id`: Get a specific video by ID.
  - `POST /api/v1/videos`: Upload a new video.
  - `PUT /api/v1/videos/:id`: Update an existing video.
  - `DELETE /api/v1/videos/:id`: Delete a video.

- **Playlists**: 
  - `GET /api/v1/playlists`: Get all playlists.
  - `GET /api/v1/playlists/:id`: Get a specific playlist by ID.
  - `POST /api/v1/upload-playlists`: Upload a new playlist.
  - `PUT /api/v1/playlists/:id`: Update an existing playlist.
  - `DELETE /api/v1/playlists/:id`: Delete a playlist.

- **Comments**: 
  - `POST /api/v1/comments/add`: Add a Comment.
  - `GET /api/v1/comment`: Fetch all comments.
  - `PUT /api/v1/comments/:id`: Update an existing comment.
  - `DELETE /api/v1/comment/:id`: Delete a comment.

- **Subscriptions**: 
  - `POST /api/v1/subscriptions/toggle-subscription`: Toggle Subscribe Button.
  - `GET /api/v1/subscriptions/`: Get a user subscribers.

- **Users**: 
  - `POST /api/v1/users/logout`: Logout user.
  - `PATCH /api/v1/users/update-password`: Update user password.
  - `PATCH /api/v1/users/update-user`: Update user account details.
  - `PATCH /api/v1/users/update-avatar`: Update user profile photo.
  - `PATCH /api/v1/users/update-coverImage`: Update user cover Image.
    
- **Like**: 
  - `POST /api/v1/likes/toggle-playlist-like/:id`: Toggle Playlist Like.
  - `POST /api/v1/likes/toggle-comment-like/:id`: Toggle comment Like.
  - `POST /api/v1/likes/toggle-video-like/:id`: Toggle Videp Like.
  - `POST /api/v1/likes/toggle-tweet-like/:id`: Toggle Tweet Like.

- **Tweet**:
  - `POST /api/v1/tweets/`: Add Tweet by a user.
  - `PATCH /api/v1/tweets/update-tweet/:id`: Update Tweet.
  - `Delete /api/v1/tweets/delete-tweet/:id`: Delete Tweet.
  - `GET /api/v1/tweets/`: Get all user tweets.


## Error Handling

The backend follows standard HTTP status codes for indicating the success or failure of requests. Error responses include appropriate status codes, along with error messages in JSON format.

If anyone want to collab on this project for making Frontend. Feel free to reach me out at [my mail](krishnnna.kapoor@gmail.com]).

## Contact

If you want to contact me, you can reach me through below handles.

[![linkedin](https://img.shields.io/badge/Krishna_Kapoor-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/krishnna14/)
[![GitHub](https://img.shields.io/badge/Krishna_Kapoor-20232A?style=for-the-badge&logo=Github&logoColor=white)](https://github.com/Krshnna/)

## Show your support

Give a ⭐️ if you like this project!

Thank you. Keep Upskilling.
