import React from "react";
import {
  FaCode,
  FaEnvelope,
  FaUserPlus,
  FaKey,
  FaThumbsUp,
  FaShare,
  FaDownload,
  FaGithub,
  FaUpload,
  FaImage,
  FaCog,
  FaDatabase
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const Patch = () => {
  return (
    <>
      <Helmet>
        <title>Patch Notes | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="History of updates and improvements to the ARTS OF IMAGINATION EVER platform." />
        <meta property="og:title" content="Patch Notes | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Track the evolution of our platform through our detailed patch notes history." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#0F172A] text-[#E5E7EB] py-12 px-4 sm:px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Patch Notes
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              History of updates and improvements to our platform
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Patch Notes Timeline */}
          <div className="space-y-8">
            {/* February 2025 */}
            <div className="bg-[#1E293B] p-6 rounded-xl border border-[#334155]">
              <h2 className="text-2xl font-semibold mb-6 text-white">February 2025</h2>
              
              {/* Feb 22 */}
              <div className="mb-8 pl-6 border-l-4 border-blue-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-400 font-mono">2025-02-22</span>
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full">MAJOR UPDATE</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaUpload className="text-blue-400" /> Admin Panel & Gallery Overhaul
                </h3>
                <div className="space-y-4">
                  <div className="bg-[#0F172A] p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FaCog className="text-yellow-400" /> Admin Panel Navigation
                    </h4>
                    <ul className="text-[#94A3B8] space-y-2">
                      <li>• Created fixed navigation bar with menu toggle</li>
                      <li>• Designed sliding menu with smooth transitions</li>
                    </ul>
                  </div>
                  <div className="bg-[#0F172A] p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FaImage className="text-purple-400" /> Upload Artwork Form
                    </h4>
                    <ul className="text-[#94A3B8] space-y-2">
                      <li>• Implemented form with title, description, author, category fields</li>
                      <li>• Added file upload with image conversion to binary for MongoDB</li>
                      <li>• Applied modern styling for better UX</li>
                    </ul>
                  </div>
                  <div className="bg-[#0F172A] p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FaImage className="text-green-400" /> Gallery Improvements
                    </h4>
                    <ul className="text-[#94A3B8] space-y-2">
                      <li>• Dynamic gallery fetching from MongoDB</li>
                      <li>• Displays artwork details (title, description, author, category)</li>
                      <li>• Fixed GitHub image likes functionality</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Feb 21 */}
              <div className="mb-8 pl-6 border-l-4 border-purple-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-purple-400 font-mono">2025-02-21</span>
                  <span className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded-full">AUTHENTICATION</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaGithub className="text-purple-400" /> GitHub Authentication Added
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• New GitHub registration and login flow</p>
                  <p>• Created GitHubUser and GitHubLogin MongoDB models</p>
                  <p>• Added GitHub buttons to Register/Login pages</p>
                  <p>• Profile now displays GitHub login method</p>
                </div>
              </div>

              {/* Feb 19 */}
              <div className="mb-8 pl-6 border-l-4 border-red-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-400 font-mono">2025-02-19</span>
                  <span className="px-2 py-1 bg-red-400/20 text-red-400 text-xs rounded-full">SECURITY</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaKey className="text-red-400" /> Forgot Password System
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• 3-step password reset flow (request, OTP verify, new password)</p>
                  <p>• Separate model for credential storage</p>
                  <p>• OTP expiration and security checks</p>
                  <p>• New UI screens for password recovery</p>
                </div>
              </div>

              {/* Feb 11 */}
              <div className="mb-8 pl-6 border-l-4 border-green-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400 font-mono">2025-02-11</span>
                  <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full">CONTENT</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaThumbsUp className="text-green-400" /> Like, Share & Download Features
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Implemented like/unlike functionality with database storage</p>
                  <p>• Added shareable links for images</p>
                  <p>• Enabled single-click downloads with original filenames</p>
                  <p>• Fixed like system authentication checks</p>
                </div>
              </div>

              {/* Feb 9 */}
              <div className="mb-8 pl-6 border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-yellow-400 font-mono">2025-02-09</span>
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full">AUTHENTICATION</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaUserPlus className="text-yellow-400" /> Authentication Improvements
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Fixed Google login route issues</p>
                  <p>• Enhanced CORS and session security</p>
                  <p>• Added Google success landing page</p>
                  <p>• Implemented profile view with login method display</p>
                </div>
              </div>

              {/* Feb 8 */}
              <div className="mb-8 pl-6 border-l-4 border-pink-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-pink-400 font-mono">2025-02-08</span>
                  <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs rounded-full">DATABASE</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaDatabase className="text-pink-400" /> Database Structure Optimization
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Created separate collections for Google and email users</p>
                  <p>• Implemented login tracking for both authentication methods</p>
                  <p>• Optimized data storage structure</p>
                </div>
              </div>

              {/* Feb 7 */}
              <div className="mb-8 pl-6 border-l-4 border-teal-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-teal-400 font-mono">2025-02-07</span>
                  <span className="px-2 py-1 bg-teal-400/20 text-teal-400 text-xs rounded-full">REGISTRATION</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaUserPlus className="text-teal-400" /> Manual Registration Added
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Implemented email/password registration</p>
                  <p>• Added OTP verification flow</p>
                  <p>• Created email users collection in MongoDB</p>
                </div>
              </div>

              {/* Feb 6 */}
              <div className="mb-8 pl-6 border-l-4 border-indigo-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-indigo-400 font-mono">2025-02-06</span>
                  <span className="px-2 py-1 bg-indigo-400/20 text-indigo-400 text-xs rounded-full">AUTHENTICATION</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaUserPlus className="text-indigo-400" /> Google Registration Enhanced
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Added username setting after Google signup</p>
                  <p>• Improved user redirection flow</p>
                  <p>• Enhanced database storage for Google users</p>
                </div>
              </div>

              {/* Feb 5 */}
              <div className="mb-8 pl-6 border-l-4 border-orange-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-orange-400 font-mono">2025-02-05</span>
                  <span className="px-2 py-1 bg-orange-400/20 text-orange-400 text-xs rounded-full">FEATURE</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaEnvelope className="text-orange-400" /> Contact Us Feature
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Implemented contact form submission</p>
                  <p>• Added confirmation emails for users</p>
                  <p>• Created admin notification system</p>
                  <p>• Enhanced newsletter signup storage</p>
                </div>
              </div>

              {/* Feb 4 */}
              <div className="mb-8 pl-6 border-l-4 border-blue-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-400 font-mono">2025-02-04</span>
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded-full">FEATURE</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" /> Newsletter Signup
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Implemented email subscription system</p>
                  <p>• Added duplicate email detection</p>
                  <p>• Created MongoDB storage for subscribers</p>
                  <p>• Added confirmation email sending</p>
                </div>
              </div>
            </div>

            {/* January 2025 */}
            <div className="bg-[#1E293B] p-6 rounded-xl border border-[#334155]">
              <h2 className="text-2xl font-semibold mb-6 text-white">January 2025</h2>
              
              {/* Jan 20 */}
              <div className="pl-6 border-l-4 border-green-400">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-400 font-mono">2025-01-20</span>
                  <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full">FOUNDATION</span>
                </div>
                <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                  <FaCode className="text-green-400" /> Project Initialization
                </h3>
                <div className="space-y-2 text-[#94A3B8]">
                  <p>• Cloned repository and set up Node.js project</p>
                  <p>• Installed Express and dotenv dependencies</p>
                  <p>• Created server.mjs and .env files</p>
                  <p>• Added .gitignore for security</p>
                  <p>• Established initial commit and GitHub push</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Patch;