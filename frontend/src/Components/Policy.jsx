import React from "react";
import { 
  FaShieldAlt, 
  FaUserLock, 
  FaUserSecret, 
  FaDatabase, 
  FaKey,
  FaEye,
  FaTrash,
  FaChartPie,
  FaExchangeAlt,
  FaUserShield,
  FaLockOpen,
  FaGlobeAmericas
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const Policy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Comprehensive privacy policy detailing how we protect and manage your personal data with transparency and security." />
        <meta property="og:title" content="Privacy Policy | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Learn how we collect, use, and safeguard your information while respecting your privacy rights." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#0F172A] text-[#E5E7EB] py-12 px-4 sm:px-6 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-5 bg-[#1E293B] rounded-full mb-6 border border-[#334155]">
              <FaShieldAlt className="text-blue-400 text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-400 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-gradient-to-r from-[#1E293B] to-[#1E3A8A] p-6 rounded-xl mb-10 border border-[#334155]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <FaUserShield className="text-blue-400 text-5xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Our Commitment to Your Privacy</h2>
                <p className="text-[#CBD5E1]">
                  At ARTS OF IMAGINATION EVER, we prioritize your privacy and data security. This policy explains how we collect, use, and protect your personal information in compliance with global privacy standards.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Data Collection Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-yellow-400/10 rounded-lg">
                  <FaDatabase className="text-yellow-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: <FaUserLock className="text-blue-400 text-xl" />,
                          title: "Account Information",
                          items: ["Username", "Email address", "Authentication tokens", "Profile preferences"]
                        },
                        {
                          icon: <FaChartPie className="text-purple-400 text-xl" />,
                          title: "Usage Data",
                          items: ["Browser type", "Device information", "IP address (anonymized)", "Interaction metrics"]
                        }
                      ].map((item, index) => (
                        <div key={index} className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-md bg-opacity-20" style={{ backgroundColor: item.icon.props.className.includes('text-blue-400') ? 'rgba(96, 165, 250, 0.1)' : 'rgba(192, 132, 252, 0.1)' }}>
                              {item.icon}
                            </div>
                            <h3 className="font-medium text-white">{item.title}</h3>
                          </div>
                          <ul className="space-y-2 text-[#94A3B8]">
                            {item.items.map((point, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <p className="text-[#CBD5E1] text-sm italic">
                      Note: We minimize data collection to only what's necessary for platform functionality and security.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-green-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-green-400/10 rounded-lg">
                  <FaEye className="text-green-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#334155]">
                          <th className="py-3 px-4 text-left text-[#CBD5E1] font-medium">Purpose</th>
                          <th className="py-3 px-4 text-left text-[#CBD5E1] font-medium">Data Used</th>
                          <th className="py-3 px-4 text-left text-[#CBD5E1] font-medium">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#334155]">
                        {[
                          {
                            purpose: "Account authentication",
                            data: "Email, authentication tokens",
                            basis: "Contractual necessity"
                          },
                          {
                            purpose: "Platform security",
                            data: "IP address, device info",
                            basis: "Legitimate interest"
                          },
                          {
                            purpose: "Service improvement",
                            data: "Usage analytics",
                            basis: "Consent (where required)"
                          },
                          {
                            purpose: "User support",
                            data: "Account information",
                            basis: "Contractual obligation"
                          }
                        ].map((row, index) => (
                          <tr key={index} className="hover:bg-[#0F172A] transition-colors">
                            <td className="py-3 px-4 text-[#E2E8F0]">{row.purpose}</td>
                            <td className="py-3 px-4 text-[#94A3B8]">{row.data}</td>
                            <td className="py-3 px-4 text-[#94A3B8]">{row.basis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-red-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-red-400/10 rounded-lg">
                  <FaLockOpen className="text-red-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Our Security Measures</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: <FaKey className="text-orange-400 text-xl" />,
                        title: "Encryption",
                        description: "All sensitive data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Passwords are hashed using bcrypt."
                      },
                      {
                        icon: <FaShieldAlt className="text-blue-400 text-xl" />,
                        title: "Access Control",
                        description: "Strict role-based access controls limit employee access to user data based on necessity."
                      },
                      {
                        icon: <FaGlobeAmericas className="text-green-400 text-xl" />,
                        title: "Infrastructure",
                        description: "Secure cloud infrastructure with regular security audits and penetration testing."
                      },
                      {
                        icon: <FaExchangeAlt className="text-purple-400 text-xl" />,
                        title: "Data Minimization",
                        description: "We only collect what we need and retain it only as long as necessary."
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B] hover:border-[#334155] transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-md bg-opacity-20" style={{ 
                            backgroundColor: item.icon.props.className.includes('text-orange-400') ? 'rgba(251, 146, 60, 0.1)' :
                            item.icon.props.className.includes('text-blue-400') ? 'rgba(96, 165, 250, 0.1)' :
                            item.icon.props.className.includes('text-green-400') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(192, 132, 252, 0.1)'
                          }}>
                            {item.icon}
                          </div>
                          <h3 className="font-medium text-white">{item.title}</h3>
                        </div>
                        <p className="text-[#94A3B8]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* User Rights Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-purple-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-purple-400/10 rounded-lg">
                  <FaUserSecret className="text-purple-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Your Privacy Rights</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: <FaEye className="text-blue-400" />,
                          title: "Right to Access",
                          description: "Request a copy of your personal data we hold."
                        },
                        {
                          icon: <FaTrash className="text-red-400" />,
                          title: "Right to Erasure",
                          description: "Request deletion of your personal data."
                        },
                        {
                          icon: <FaExchangeAlt className="text-green-400" />,
                          title: "Right to Portability",
                          description: "Receive your data in a structured format."
                        },
                        {
                          icon: <FaUserLock className="text-yellow-400" />,
                          title: "Right to Restriction",
                          description: "Limit how we use your data in certain circumstances."
                        }
                      ].map((right, index) => (
                        <div key={index} className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-md" style={{ 
                              backgroundColor: right.icon.props.className.includes('text-blue-400') ? 'rgba(96, 165, 250, 0.1)' :
                              right.icon.props.className.includes('text-red-400') ? 'rgba(248, 113, 113, 0.1)' :
                              right.icon.props.className.includes('text-green-400') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)'
                            }}>
                              {right.icon}
                            </div>
                            <h3 className="font-medium text-white">{right.title}</h3>
                          </div>
                          <p className="text-[#94A3B8] text-sm">{right.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                      <p className="text-[#CBD5E1]">
                        To exercise any of these rights, please contact us through our support channels. We respond to all legitimate requests within 30 days.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Policy Updates */}
            <div className="bg-gradient-to-r from-[#1E293B] to-[#1E3A8A] p-6 rounded-xl border border-[#334155]">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FaShieldAlt className="text-blue-400 text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Policy Updates</h3>
                  <p className="text-[#CBD5E1]">
                    We may update this Privacy Policy to reflect changes in our practices. We'll notify you of significant changes through our platform or email (if subscribed). Your continued use after changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policy;