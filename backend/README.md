
# 🎨 Backend Setup for ARTS OF IMAGINATION 🚀  
First Progress - (20-01-2025)  

Welcome to the ARTS OF IMAGINATION project! This document outlines the backend setup steps, ensuring a smooth development workflow for all team members.  

## 🛠 Setup Steps:  

1️⃣ Clone the Repository 📂  
   First, we cloned the project repository from GitHub to our local machine.  
   ```bash
   git clone https://github.com/your-repo-link.git
   ```

2️⃣ Set Up Node.js 🌱  
   We initialized the Node.js project using `npm init`, which created the `package.json` file to manage dependencies and scripts.  

3️⃣ Install Dependencies 📦  
   We installed essential dependencies:  
   - 🏗 Express → for handling HTTP requests  
   - 🔐 dotenv → for managing environment variables  

   ```bash
   npm install express dotenv
   ```

4️⃣ Create `server.mjs` ⚙️  
   The core of our backend setup is in the `server.mjs` file, which initializes the server, listens on a defined port, and serves the application.  

5️⃣ Create `.env` File 🔐  
   We created an `.env` file to store environment variables securely (like the port number, database credentials, etc.).  
   This file is ignored by Git to ensure security.  

6️⃣ Add `.gitignore` 🚫  
   To prevent unnecessary files from being tracked by Git, we added a `.gitignore` file that includes:  
   - `node_modules/` → avoids tracking dependency folder  
   - `.env` → keeps sensitive information safe  

7️⃣ Commit the Changes 💾  
   After adding all necessary files, we committed the changes with a clear message.  

8️⃣ Push to GitHub 🌍  
   Finally, we pushed the committed changes to the remote repository:  
   ```bash
   git push origin <branch-name>
   ```




# 🚀 Project Updates & Patch Notes  

📢 04-02-2025 - Newsletter Signup Feature Added  
✅ Implemented Newsletter Signup with MongoDB integration.  
📌 Flow:  
   - Users can subscribe using their email.  
   - If the email already exists, a ⚠️ popup alert appears: `"Email already exists"`.  
   - If new, the email is stored in MongoDB and a ✉️ confirmation email is sent.  

✅ Changes pushed to GitHub.  





📢 05-02-2025 - Contact Us Feature Added  
✅ Users can now submit contact forms.  
📌 Flow:  
   - 📩 Users receive a confirmation email upon submission.  
   - 📥 Admins receive the request details.  

✅ Newsletter Signup Option Enhanced:  
   - 🗂 Email storage in MongoDB is now fully implemented.  
   - 🚀 UI notification added when email already exists.  

✅ Changes successfully pushed to GitHub.  





📢 06-02-2025 - Google Registration Enhanced  
🚀 New Google Registration Flow:  
1️⃣ Sign up using Google.  
2️⃣ User details are stored in MongoDB.  
3️⃣ A Set Username Screen now appears, allowing users to customize their username.  
4️⃣ After setting a username, users are redirected to the login page.  

✅ Google authentication is now seamless and user-friendly!  

📢 07-02-2025 - Manual Registration Added  
✅ Users can now register manually with:  
   - 👤 Username  
   - ✉️ Email  
   - 🔑 Password  
   - 🔄 OTP Verification  

🚀 New OTP Flow:  
   - After entering an email, users receive an OTP.  
   - If OTP is correct, they proceed to login, and details are stored in MongoDB.  

🔥 Pushed to GitHub with full implementation!  






📢 08-02-2025 - Major Authentication Overhaul  
✅ Google Authentication Fully Implemented  
   - Users who signed up via Google can now log in smoothly.  
   - Unregistered users are prompted to complete registration.  

✅ Manual Login & Registration with OTP  
   - Secure email + password authentication  
   - OTP verification for safe user authentication  

✅ Database Structure Optimized  
   - 🗄 Google Users Collection → Stores Google signups.  
   - 📝 Google Login Tracking → Logs successful Google logins.  
   - 📂 Email Users Collection → Stores manual registrations.  
   - 🛡 Email Login Tracking → Logs successful manual logins.  

✅ Finalized & Pushed to GitHub  
   - 🏗 Code is fully structured and available for collaboration.  



📢 09-02-2025 - ARTS OF IMAGINATION Patch Update  
🔥 Today's Highlights:  
We refined Google Authentication, security, and the user experience!  

✅ Fixed Google Login Bugs  
   - 🛠 Resolved route issues causing login failures.  
   - 🚀 Enhanced authentication stability & reliability.  

🔒 Increased CORS & Session Security  
   - 🛡 Strengthened API security to prevent unauthorized access.  
   - 🔄 Improved session management for better protection.  

🚀 Google Success Landing Page Implemented  
   - 📌 Ensures user credentials are stored before redirecting to the home page.  

👤 Users Can Now View Their Profile  
   - ✨ Displays username, email, and login method (Google/Manual).  
   - 🎨 UI upgraded for a modern, dark-themed profile section.  

📤 Code Pushed to GitHub  
   - ✅ Latest updates are live!  

🔥🔥 More features and improvements coming soon!  

📌 Happy coding, team! 🚀🔥  
#AOIE 💻🎨  





📌 ARTS OF IMAGINATION EVER Patch Notes – February 11, 2025 🎨🚀

🎉 New Features & Improvements
✅ Like Feature Added ❤️
Users can now like/unlike images.
Likes are stored in the database and update dynamically.
Clicking the like button toggles the like state instantly.


✅ Share Feature Implemented 📤
Users can copy a shareable link for each image.
Opening a shared link will display the specific image on the website.


✅ Download Feature Added ⬇️
Users can download images with a single click.
Downloaded images retain their original file name for easy identification.


🔧 Fixes & Enhancements

🛠 Like System Improvements ✅
Fixed an issue where likes were not updating correctly.
Implemented authentication checks to prevent unauthenticated likes.

🛠 Share Link Fixes 🔗
Ensured the correct image is displayed when opening a shared link.

🛠 Download Enhancements 📁
Improved download button functionality for better user experience.

🛠️ ARTS OF IMAGINATION EVER Patch Notes - 19th Feb 2025 🛠️
🚀 New Feature: Forgot Password System Implemented

1️⃣ Added Password Reset Flow
🔹 Users can now reset their password if they forget it.
🔹 Implemented a 3-step process:

Request Reset: Enter email/username to receive OTP.
Verify OTP: Enter the OTP sent via email.
Reset Password: Set a new password after OTP verification.
2️⃣ Backend Updates
✅ Created separate model for storing user credentials (previously, login records were being updated instead).
✅ Implemented OTP storage & expiration to ensure security.
✅ Enhanced MongoDB update logic for better password reset handling.
✅ Improved error handling & logging to debug issues easily.

3️⃣ Frontend Updates
🖥️ New UI screens added for:

Forgot Password Page (Enter email/username).
OTP Verification Page.
Set New Password Page.
🎨 Improved user experience with clear success & error messages.
💡 How It Works?
1️⃣ Click "Forgot Password" on the login page.
2️⃣ Enter your email/username to receive an OTP.
3️⃣ Check your email for the OTP & enter it on the website.
4️⃣ Set a new password after OTP verification.
5️⃣ Log in with the new password! 🎉

🔧 Bug Fixes & Improvements
🔹 Fixed issue where wrong model was used for password updates.
🔹 Improved database queries for faster performance.
🔹 Optimized API error handling for better debugging.




🚀 ARTS OF IMAGINATION EVER MAJOR UPDATE - 2025-02-21 🎉
🔥 What's New?

🛠️ GitHub Authentication Added!
Now you can register & log in using GitHub! 🎯

✅ New Files Created:
📌 /models/GitHubUser.mjs → Stores GitHub-registered users.
📌 /models/GitHubLogin.mjs → Stores GitHub login sessions.
📌 /routes/githubAuthRoutes.mjs → Handles GitHub authentication.
📌 /frontend/pages/GitHubSuccess.jsx → Handles successful GitHub login.

✅ Modified Files:
🔹 /backend/server.mjs → Mounted GitHub authentication routes.
🔹 /backend/routes/authRoutes.mjs → Added GitHub authentication logic.
🔹 /frontend/pages/Register.jsx → GitHub Register button added.
🔹 /frontend/pages/Login.jsx → GitHub Login button added.
🔹 /frontend/components/Profile.jsx → Displays GitHub login method.
🔹 /frontend/components/Navbar.jsx → Now supports GitHub login/logout handling.

💡 How It Works?
1️⃣ Click GitHub Register → Authorize GitHub Login.
2️⃣ Set a username → Stored in MongoDB (githubusers).
3️⃣ Redirected to Login Page → Log in using GitHub.
4️⃣ Login details stored in githublogins.
5️⃣ Redirected to Home Page → Profile updates dynamically!

✉️ Contact Us - Now in a Separate File!
📌 New Route: /routes/contactRoutes.mjs
📌 Cleaned server.mjs → No more clutter!

🎨 Professional Email Formatting ✨
💌 Contact emails now use HTML & CSS formatting for a clean & professional look!

💥 Newsletter Improvement!

Users now receive a confirmation email in a stylish, professional HTML format after registering.
Admin also receives detailed user info in a formatted email for better tracking.
🔥 RESULT?
🚀 Smoother Authentication Flow
📩 Better Email Presentation
🧹 Clean & Organized Codebase
📧 Improved Newsletter Communication

💯 Mission Accomplished! ✅🎉


🚀 MAJOR UPDATE 🔥🔥 ARTS OF IMAGINATION EVER Patch Note - February 22, 2025 📝
Overview:
Today, I’ve made significant progress in improving the Admin Panel and Gallery components. A major revamp of the image upload system has been implemented, with better UI/UX design, image storage in MongoDB, and improved functionality for managing artwork. We also fixed issues related to GitHub image likes and streamlined the process of displaying images with their details.

What Was Done:
Admin Panel Navigation 🔧:  (server support design already done by @ashok)

Navigation Bar: Created a fixed navigation bar with a menu toggle feature. The menu can be accessed via the menu icon, and it includes an Upload button for admins to access the upload functionality.
Sliding Menu: Designed a sliding menu that appears when the admin clicks the menu button, providing a smooth transition from hidden to visible. This menu includes options such as the Upload button.
Upload Artwork Form 🖼️:

Form Implementation: Developed a form to allow admins to submit artwork details, including the following fields:
Title ✍️ (text input)
Description ✏️ (textarea)
Author 🖋️ (text input)
Category 📂 (dropdown selection)
Upload Image 📸 (file input)
Form Validation: Ensured all fields are required to be filled out before submission, preventing incomplete submissions.
File Handling: Implemented the file upload feature, which allows image files to be selected and submitted along with the other details.
Image Conversion: Images are now converted to binary during storage in MongoDB. When fetched, the images are converted back to their original format for display. 🖼️
Form Styling: Applied custom styling to the form, making it visually consistent with the overall admin panel design. The form has a modern, user-friendly look, ensuring a smooth user experience. 🎨
Gallery Display 🖼️:

Dynamic Gallery: Completely remade the gallery to remove static images. The gallery now fetches images dynamically from MongoDB, displaying artwork along with their details in real-time as new uploads are submitted.


Display Details: Each gallery item displays:
Title of the artwork 🎨
Description of the artwork 📖
Author of the artwork ✍️
Category of the artwork 🏷️
Image (with proper handling for image preview) 📸


Fallback: Implemented a fallback message that appears when no data has been uploaded, displaying “No uploads yet.” 🕒
Image Fetching: When images are retrieved from MongoDB, they are converted back to their original format for proper display. 🌐
GitHub Image Likes Fix 🐛:



Fixed Issue: Addressed a bug where GitHub images weren’t properly liking or displaying liked images. Now, GitHub users can like images correctly, and the system functions as expected. ✅
Responsive Design 📱:


How It Works:
Navigation & Menu: The admin can click the menu icon in the navigation bar to toggle the sliding menu. The Upload button in the menu opens the form where admins can submit new artwork details. 📂
Artwork Submission: Admins fill in the Title, Description, Author, and Category for each artwork, and upload an image through the file input. The image is then stored as binary data in MongoDB. Upon form submission, the artwork data is processed, and the new artwork is displayed in the gallery. 🖼️


Gallery Updates Dynamically: Once new artwork is uploaded, it is displayed in the Gallery section of the admin panel. Each artwork’s title, description, author, and category are displayed, along with the uploaded image. The images are stored as binary data in MongoDB and are converted back to their original format when fetched for display. 🔄
GitHub Likes: Fixed the issue with GitHub-like images where likes were not being recorded or displayed correctly. Likes are now fully functional for all users, including those registered via GitHub. ❤️