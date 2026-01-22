import React from "react";
import {
  FaGavel, FaUserShield, FaRegCheckCircle, FaUserLock, FaExclamationTriangle,
  FaEnvelope, FaTrashAlt, FaBan, FaClock, FaUserTimes, FaUserSecret, FaUserCheck,
  FaBook, FaShieldAlt, FaInfoCircle, FaQuestionCircle, FaGlobe, FaLock
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Comprehensive Terms and Conditions for ARTS OF IMAGINATION EVER. Understand your rights and responsibilities when using our platform and gallery services." />
        <meta property="og:title" content="Terms and Conditions | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Official Terms and Conditions for ARTS OF IMAGINATION EVER platform. Learn about user rights, content policies, and platform rules." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-black p-6 md:p-12 mt-16">
        <div className="max-w-5xl mx-auto bg-[#121E3A] p-8 rounded-lg shadow-lg border border-[#1E40AF]">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            <p className="text-[#D1D5DB] text-lg max-w-3xl mx-auto">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="mb-10 bg-[#1E3A8A] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-blue-300" /> Important Notice
            </h2>
            <p className="text-[#E5E7EB]">
              By accessing or using the ARTS OF IMAGINATION EVER platform, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-[#1F2937] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#60A5FA] mb-4 flex items-center gap-2">
                <FaUserShield className="text-blue-400" /> Account Terms
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <FaRegCheckCircle className="text-green-400 text-xl" />, 
                    title: "Account Registration", 
                    text: "Users can register with the same email across different login methods (Google, GitHub, Discord, Manual). All accounts must represent a real individual or entity." },
                  { icon: <FaUserLock className="text-blue-400 text-xl" />, 
                    title: "Account Security", 
                    text: "You are responsible for maintaining the confidentiality of your account credentials. All passwords are hashed and encrypted for security." },
                  { icon: <FaUserShield className="text-blue-500 text-xl" />, 
                    title: "Account Recovery", 
                    text: "Account recovery is possible if users provide email proof. If an account is hacked or email is lost, we can recover it with proper evidence and verification." },
                  { icon: <FaTrashAlt className="text-red-400 text-xl" />, 
                    title: "Account Deletion", 
                    text: "Users can request account deletion via the Contact Us page. Deletion takes 24 hours to 7 days depending on traffic. All associated data will be permanently removed." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 hover:bg-[#2D3748] rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#E5E7EB]">{item.title}</h3>
                      <p className="text-[#D1D5DB]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1F2937] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#60A5FA] mb-4 flex items-center gap-2">
                <FaGavel className="text-purple-400" /> Content & Conduct
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <FaExclamationTriangle className="text-yellow-500 text-xl" />, 
                    title: "Prohibited Content", 
                    text: "Users must not upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable." },
                  { icon: <FaShieldAlt className="text-blue-400 text-xl" />, 
                    title: "Content Moderation", 
                    text: "We reserve the right to remove any content that violates our policies without prior notice. Repeated violations may result in account suspension or termination." },
                  { icon: <FaBan className="text-red-500 text-xl" />, 
                    title: "Prohibited Activities", 
                    text: "Bots, automated scripts, brute-force attacks, DDoS attacks, or any malicious activities are strictly prohibited. Violators will be IP banned." },
                  { icon: <FaRegCheckCircle className="text-green-400 text-xl" />, 
                    title: "Likes System", 
                    text: "Users can remove their likes, but if not removed, likes are saved permanently. Like manipulation through artificial means is prohibited." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 hover:bg-[#2D3748] rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#E5E7EB]">{item.title}</h3>
                      <p className="text-[#D1D5DB]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1F2937] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#60A5FA] mb-4 flex items-center gap-2">
                <FaUserCheck className="text-green-400" /> User Responsibilities
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <FaGlobe className="text-blue-400 text-xl" />, 
                    title: "Age Requirements", 
                    text: "Users under 18 years old are allowed on the website as there is no 18+ content. Parental supervision is advised for younger users." },
                  { icon: <FaLock className="text-yellow-400 text-xl" />, 
                    title: "Privacy", 
                    text: "You are responsible for maintaining the privacy of your personal information. Be cautious about what information you share on the platform." },
                  { icon: <FaBook className="text-purple-400 text-xl" />, 
                    title: "Compliance", 
                    text: "You agree to comply with all applicable laws and regulations while using our services." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 hover:bg-[#2D3748] rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#E5E7EB]">{item.title}</h3>
                      <p className="text-[#D1D5DB]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1F2937] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#60A5FA] mb-4 flex items-center gap-2">
                <FaClock className="text-orange-400" /> Platform Administration
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <FaUserSecret className="text-pink-400 text-xl" />, 
                    title: "Admin Applications", 
                    text: "Admins are artists who can apply for admin status via the Contact Us page. Approval is manual and based on platform needs and user trustworthiness." },
                  { icon: <FaBan className="text-red-500 text-xl" />, 
                    title: "Account Suspension", 
                    text: "We employ a 3-strike rule for policy violations. Serious violations may result in immediate account termination without warning." },
                  { icon: <FaClock className="text-orange-400 text-xl" />, 
                    title: "Inactivity Policy", 
                    text: "There is no automatic account deletion for inactivity. However, users can request deletion, and inactive accounts may be periodically reviewed." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 hover:bg-[#2D3748] rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#E5E7EB]">{item.title}</h3>
                      <p className="text-[#D1D5DB]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1F2937] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-[#60A5FA] mb-4 flex items-center gap-2">
                <FaEnvelope className="text-blue-400" /> Communications
              </h2>
              <div className="space-y-4">
                {[
                  { icon: <FaExclamationTriangle className="text-yellow-500 text-xl" />, 
                    title: "Third-party Authentication", 
                    text: "We are not responsible for issues related to third-party authentication (Google, GitHub, Discord, etc.). Any problems should be directed to the respective service providers." },
                  { icon: <FaEnvelope className="text-blue-400 text-xl" />, 
                    title: "Updates Notification", 
                    text: "Terms & Conditions updates will be notified 1 month in advance. Users will be notified of updates via email (if subscribed). We avoid spamming users." },
                  { icon: <FaQuestionCircle className="text-teal-400 text-xl" />, 
                    title: "Contact", 
                    text: "For any questions regarding these Terms, please contact us through our official channels." },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 hover:bg-[#2D3748] rounded-lg transition-colors">
                    <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-[#E5E7EB]">{item.title}</h3>
                      <p className="text-[#D1D5DB]">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-[#1E3A8A] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-blue-300" /> Disclaimer
              </h2>
              <p className="text-[#E5E7EB]">
                ARTS OF IMAGINATION EVER reserves the right to modify these Terms at any time. Your continued use of the platform after such changes constitutes your acceptance of the new Terms. 
                We are not liable for any damages resulting from the use or inability to use our services.
              </p>
              <p className="text-[#E5E7EB] mt-4">
                These Terms constitute the entire agreement between you and ARTS OF IMAGINATION EVER regarding your use of the platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;