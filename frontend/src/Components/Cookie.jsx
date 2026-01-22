import React from "react";
import { 
  FaCookieBite, 
  FaUserShield, 
  FaLock, 
  FaClipboardCheck,
  FaShieldAlt,
  FaCog,
  FaTrash,
  FaChartLine,
  FaMobileAlt,
  FaEyeSlash
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const Cookie = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Learn how we use cookies to enhance security, improve functionality, and personalize your experience on our platform." />
        <meta property="og:title" content="Cookie Policy | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Our comprehensive cookie policy explains how we use cookies to create a better experience while respecting your privacy." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#121E3A] text-[#E5E7EB] py-12 px-4 sm:px-6 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-[#1E293B] rounded-full mb-6">
              <FaCookieBite className="text-yellow-400 text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction Banner */}
          <div className="bg-gradient-to-r from-[#1E293B] to-[#1E3A8A] p-6 rounded-xl mb-10 border border-[#334155]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <FaShieldAlt className="text-yellow-400 text-5xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Our Commitment to Transparency</h2>
                <p className="text-[#CBD5E1]">
                  We believe in being clear about how we use cookies and similar technologies. This policy explains what cookies are, how we use them, and your choices regarding their use.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* What Are Cookies Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-yellow-400/10 rounded-lg">
                  <FaCookieBite className="text-yellow-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">What Are Cookies?</h2>
                  <div className="space-y-4 text-[#CBD5E1]">
                    <p>
                      Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit websites. They are widely used to make websites work more efficiently and to provide information to website owners.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-[#0F172A] p-4 rounded-lg border border-[#1E293B]">
                        <h3 className="font-medium text-yellow-400 mb-2">First-party Cookies</h3>
                        <p>Set by our website directly, essential for proper functioning.</p>
                      </div>
                      <div className="bg-[#0F172A] p-4 rounded-lg border border-[#1E293B]">
                        <h3 className="font-medium text-yellow-400 mb-2">Session Cookies</h3>
                        <p>Temporary cookies deleted when you close your browser.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Cookies Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-blue-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-blue-400/10 rounded-lg">
                  <FaClipboardCheck className="text-blue-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Cookies</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: <FaUserShield className="text-green-400 text-xl" />,
                          title: "Authentication",
                          desc: "Secure login and session management to protect your account."
                        },
                        {
                          icon: <FaChartLine className="text-purple-400 text-xl" />,
                          title: "Analytics",
                          desc: "Understand how visitors interact with our platform to improve it."
                        },
                        {
                          icon: <FaCog className="text-yellow-400 text-xl" />,
                          title: "Preferences",
                          desc: "Remember your settings and preferences for a personalized experience."
                        },
                        {
                          icon: <FaMobileAlt className="text-blue-400 text-xl" />,
                          title: "Performance",
                          desc: "Optimize website speed and responsiveness across devices."
                        }
                      ].map((item, index) => (
                        <div key={index} className="bg-[#0F172A] p-4 rounded-lg border border-[#1E293B] hover:border-[#334155] transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-opacity-20 rounded-md" style={{ backgroundColor: `${item.icon.props.className.includes('text-green-400') ? 'rgba(74, 222, 128, 0.1)' : 
                                                                                          item.icon.props.className.includes('text-purple-400') ? 'rgba(192, 132, 252, 0.1)' : 
                                                                                          item.icon.props.className.includes('text-yellow-400') ? 'rgba(250, 204, 21, 0.1)' : 'rgba(96, 165, 250, 0.1)'}`}}>
                              {item.icon}
                            </div>
                            <h3 className="font-medium text-white">{item.title}</h3>
                          </div>
                          <p className="text-[#94A3B8] text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Types Details */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-purple-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-purple-400/10 rounded-lg">
                  <FaShieldAlt className="text-purple-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Types of Cookies We Use</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#334155]">
                          <th className="py-3 px-4 text-left text-[#CBD5E1] font-medium">Cookie Type</th>
                          <th className="py-3 px-4 text-left text-[#CBD5E1] font-medium">Purpose</th>
                          <th className="py-3 px-4 text-left text-[#CBD5E1] font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#334155]">
                        {[
                          {
                            name: "auth_token",
                            purpose: "User authentication and session management",
                            duration: "Session"
                          },
                          {
                            name: "preferences",
                            purpose: "Stores user interface preferences",
                            duration: "1 year"
                          },
                          {
                            name: "analytics_consent",
                            purpose: "Remembers your cookie preferences",
                            duration: "1 year"
                          },
                          {
                            name: "performance",
                            purpose: "Load balancing and site optimization",
                            duration: "24 hours"
                          }
                        ].map((cookie, index) => (
                          <tr key={index} className="hover:bg-[#0F172A] transition-colors">
                            <td className="py-3 px-4 text-[#E2E8F0] font-mono">{cookie.name}</td>
                            <td className="py-3 px-4 text-[#94A3B8]">{cookie.purpose}</td>
                            <td className="py-3 px-4 text-[#94A3B8]">{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Managing Cookies Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-red-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-red-400/10 rounded-lg">
                  <FaLock className="text-red-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Managing Your Cookie Preferences</h2>
                  <div className="space-y-6 text-[#CBD5E1]">
                    <p>
                      You have control over how cookies are used on your device. Below are ways to manage them:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                        <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                          <FaCog className="text-yellow-400" /> Browser Settings
                        </h3>
                        <p className="mb-3">Most browsers allow you to:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>View and delete existing cookies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>Block cookies from specific sites</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>Block all cookies</span>
                          </li>
                        </ul>
                        <p className="mt-4 text-sm text-[#94A3B8]">
                          Note: Blocking essential cookies may impact website functionality.
                        </p>
                      </div>
                      
                      <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                        <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                          <FaEyeSlash className="text-blue-400" /> Opt-Out Tools
                        </h3>
                        <p className="mb-3">For analytics and advertising cookies:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Use our cookie consent manager (available in footer)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Industry opt-out programs like NAI or DAA</span>
                          </li>
                        </ul>
                        <p className="mt-4 text-sm text-[#94A3B8]">
                          These don't block cookies but prevent their use for certain purposes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B] mt-4">
                      <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                        <FaTrash className="text-red-400" /> Deleting Cookies
                      </h3>
                      <p>
                        You can delete existing cookies through your browser settings. This will log you out of websites and may reset preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Notice */}
            <div className="bg-gradient-to-r from-[#1E293B] to-[#1E3A8A] p-6 rounded-xl border border-[#334155]">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <FaShieldAlt className="text-yellow-400 text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Policy Updates</h3>
                  <p className="text-[#CBD5E1]">
                    We may update this Cookie Policy periodically. Significant changes will be announced on our platform. Your continued use after changes constitutes acceptance of the updated policy.
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

export default Cookie;