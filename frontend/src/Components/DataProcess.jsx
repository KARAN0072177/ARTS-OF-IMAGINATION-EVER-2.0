import React from "react";
import {
  FaServer,
  FaShieldAlt,
  FaUserCog,
  FaChartLine,
  FaSyncAlt,
  FaDatabase,
  FaClipboardCheck,
  FaGlobe
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';

const DataProcess = () => {
  return (
    <>
      <Helmet>
        <title>Data Processing Policy | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Learn how we process your data with integrity, security, and transparency at ARTS OF IMAGINATION EVER." />
        <meta property="og:title" content="Data Processing Policy | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Detailed information about our data processing practices, security measures, and your rights." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black to-[#0F172A] text-[#E5E7EB] py-12 px-4 sm:px-6 mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-5 bg-[#1E293B] rounded-full mb-6 border border-[#334155]">
              <FaServer className="text-teal-400 text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Data Processing Policy
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-gradient-to-r from-[#1E293B] to-[#1E3A8A] p-6 rounded-xl mb-10 border border-[#334155]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <FaClipboardCheck className="text-teal-400 text-5xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Our Data Processing Principles</h2>
                <p className="text-[#CBD5E1]">
                  We process data lawfully, fairly, and transparently. Our systems are designed with privacy by default,
                  ensuring minimal data collection and maximum protection throughout the processing lifecycle.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Processing Purposes Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-teal-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-teal-400/10 rounded-lg">
                  <FaChartLine className="text-teal-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Purposes of Processing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        icon: <FaUserCog className="text-blue-400" />,
                        title: "Account Management",
                        description: "User authentication, profile management, and platform access control"
                      },
                      {
                        icon: <FaShieldAlt className="text-green-400" />,
                        title: "Security Operations",
                        description: "Fraud prevention, system integrity checks, and threat detection"
                      },
                      {
                        icon: <FaSyncAlt className="text-purple-400" />,
                        title: "Service Optimization",
                        description: "Performance monitoring, error resolution, and quality improvement"
                      },
                      {
                        icon: <FaGlobe className="text-yellow-400" />,
                        title: "Compliance",
                        description: "Legal obligations, regulatory requirements, and policy enforcement"
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B] hover:border-[#334155] transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-md bg-opacity-20" style={{
                            backgroundColor: item.icon.props.className.includes('text-blue-400') ? 'rgba(96, 165, 250, 0.1)' :
                              item.icon.props.className.includes('text-green-400') ? 'rgba(74, 222, 128, 0.1)' :
                                item.icon.props.className.includes('text-purple-400') ? 'rgba(192, 132, 252, 0.1)' : 'rgba(250, 204, 21, 0.1)'
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

            {/* Processing Methods Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-blue-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-blue-400/10 rounded-lg">
                  <FaDatabase className="text-blue-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Processing Methods</h2>
                  <div className="space-y-6">
                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                      <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                        <FaShieldAlt className="text-green-400" /> Automated Processing
                      </h3>
                      <ul className="space-y-2 text-[#94A3B8]">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>Data encryption during transmission and storage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>Automated security scanning for vulnerabilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>System-generated logs for audit trails</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                      <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                        <FaUserCog className="text-blue-400" /> Manual Processing
                      </h3>
                      <ul className="space-y-2 text-[#94A3B8]">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Admin review for account recovery requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Manual data exports for user requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Human review for suspicious activity reports</span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                        <h4 className="font-medium text-[#E2E8F0] mb-2">Data Minimization</h4>
                        <p className="text-[#94A3B8] text-sm">
                          We only process data necessary for specific, explicit purposes and limit access to authorized personnel.
                        </p>
                      </div>
                      <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                        <h4 className="font-medium text-[#E2E8F0] mb-2">Storage Limitation</h4>
                        <p className="text-[#94A3B8] text-sm">
                          Data is retained only as long as required for its processing purpose or legal obligations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Flows Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-purple-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-purple-400/10 rounded-lg">
                  <FaSyncAlt className="text-purple-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Data Flow & Transfers</h2>
                  <div className="space-y-6">
                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                      <h3 className="font-semibold text-lg mb-3 text-white">Internal Processing</h3>
                      <p className="text-[#94A3B8] mb-4">
                        All data processing occurs within our secure cloud infrastructure with these safeguards:
                      </p>
                      <ul className="space-y-2 text-[#94A3B8]">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>End-to-end encryption for all internal data transfers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Role-based access controls with multi-factor authentication</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>Regular security audits of all processing activities</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                      <h3 className="font-semibold text-lg mb-3 text-white">Third-Party Processors</h3>
                      <p className="text-[#94A3B8] mb-4">
                        We carefully vet all third-party processors and maintain contracts that require:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "GDPR/SCC compliance",
                          "Data protection equal to ours",
                          "Immediate breach notification",
                          "Processing only per our instructions"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <span className="text-[#94A3B8]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights Section */}
            <section className="bg-[#1E293B] p-8 rounded-xl border border-[#334155] hover:border-yellow-400 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 p-3 bg-yellow-400/10 rounded-lg">
                  <FaUserCog className="text-yellow-400 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-white">Your Control Over Processing</h2>
                  <div className="space-y-6">
                    <p className="text-[#CBD5E1]">
                      You have rights regarding how we process your data, including:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Access & Portability",
                          description: "Request a copy of your processed data in machine-readable format"
                        },
                        {
                          title: "Rectification",
                          description: "Correct inaccurate or incomplete personal data"
                        },
                        {
                          title: "Restriction",
                          description: "Limit processing under certain circumstances"
                        },
                        {
                          title: "Objection",
                          description: "Object to specific processing activities"
                        }
                      ].map((right, index) => (
                        <div key={index} className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                          <h3 className="font-medium text-white mb-2">{right.title}</h3>
                          <p className="text-[#94A3B8] text-sm">{right.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0F172A] p-5 rounded-lg border border-[#1E293B]">
                      <p className="text-[#CBD5E1]">
                        To exercise these rights or for questions about our processing activities, please contact our Data Protection Officer through our support channels.
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
                  <FaClipboardCheck className="text-teal-400 text-3xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Policy Review Cycle</h3>
                  <p className="text-[#CBD5E1]">
                    This Data Processing Policy is reviewed annually or when significant changes occur to our processing activities. 
                    We will notify users of material changes through platform notifications or email.
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

export default DataProcess;