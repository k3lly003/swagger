'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@workspace/ui/components/button";
import Header from "@/components/layout/header";
import { Container } from "@/components/container";
import { Twitter, Linkedin, Mail, Phone, Users, Blocks, Briefcase, Users2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

// Use this hook to get the dictionary if needed
// import { useDictionary } from '@/hooks/use-dictionary'; // Implement this hook if needed

const applicationSteps = [
  {
    id: 1,
    title: "Applications Received",
    description: "Submit your application through our online portal. Make sure to include all required documents and information.",
    image: "/images/application-received.png"
  },
  {
    id: 2,
    title: "Applications Reviewed",
    description: "Our team carefully reviews each application, assessing qualifications, experience, and alignment with our mission.",
    image: "/images/application-review.png"
  },
  {
    id: 3,
    title: "Finalist Chosen",
    description: "Selected candidates proceed to interviews and additional assessments to determine final fellowship recipients.",
    image: "/images/finalist-chosen.png"
  },
  {
    id: 4,
    title: "Fellows Notified",
    description: "Successful candidates are notified and begin their journey with GanzAfrica Fellowship Program.",
    image: "/images/fellows-notified.png"
  }
];

const eligibilityCriteria = [
  {
    title: "Up to 27 years old",
    description: "Young professionals at the start of their career journey"
  },
  {
    title: "A degree in a relevant discipline",
    description: "Academic background in agriculture, environmental science, data science, or related fields"
  },
  {
    title: "Commitment to leading Africa's transformation",
    description: "Demonstrated passion for sustainable development and positive change"
  }
];

const FellowshipJourney = () => {
  return (
      <div className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-20">
            GanzAfrica's Promise <span className="text-[#00A15D]">to</span>
            <br />
            <span className="text-[#FDB022]">Fellows:</span>
          </h2>
          <div className="relative">
            {/* Journey Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative">
                <p className="text-gray-800 text-lg max-w-[250px] mb-6">
                  High-achieving young professionals are recruited as GanzAfrica fellows
                </p>
                <div className="w-[88px] h-[88px] bg-[#00A15D] rounded-full flex items-center justify-center relative z-10">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-[88px] h-[88px] bg-[#FDB022] rounded-full flex items-center justify-center mb-6 relative z-10">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <p className="text-gray-800 text-lg max-w-[250px]">
                  GanzAfrica Academy provides capacity building on data-led approaches and leadership
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative">
                <p className="text-gray-800 text-lg max-w-[250px] mb-6">
                  Fellows are placed in public institutions and empowered to shape policy approaches
                </p>
                <div className="w-[88px] h-[88px] bg-[#00A15D] rounded-full flex items-center justify-center relative z-10">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative">
                <div className="w-[88px] h-[88px] bg-[#FDB022] rounded-full flex items-center justify-center mb-6 relative z-10">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <p className="text-gray-800 text-lg max-w-[250px]">
                  Fellows receive mentorship from experts, advancing their careers, leadership skills, and providing ongoing support
                </p>
              </div>

              {/* Connecting Lines with Curves */}
              <div className="absolute top-[44%] left-[15%] right-[15%] hidden lg:block">
                {/* Main connecting line */}
                <div className="absolute w-full h-0.5 bg-[#00A15D]" />

                {/* Curved connectors using SVG */}
                <svg className="absolute left-[20%] -top-4 w-32 h-8" viewBox="0 0 128 32" fill="none">
                  <path d="M0 16 C32 16, 96 16, 128 16" stroke="#00A15D" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                <svg className="absolute left-[45%] -top-4 w-32 h-8" viewBox="0 0 128 32" fill="none">
                  <path d="M0 16 C32 16, 96 16, 128 16" stroke="#00A15D" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                <svg className="absolute left-[70%] -top-4 w-32 h-8" viewBox="0 0 128 32" fill="none">
                  <path d="M0 16 C32 16, 96 16, 128 16" stroke="#00A15D" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* Vertical connectors for mobile */}
              <div className="lg:hidden absolute left-1/2 top-[88px] bottom-0 w-0.5 bg-[#00A15D] -translate-x-1/2">
                <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-t-2 border-r-2 border-[#00A15D]" />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default function HowToApplyPage() {
  const [isNotifying, setIsNotifying] = useState(false);

  // Get locale from URL params
  const params = useParams<{ locale: string }>();
  const locale = params.locale as string;

  // Example of how you might get dictionary data if needed
  // const dict = useDictionary(locale);

  const handleNotifyMe = () => {
    setIsNotifying(true);
    // Add notification logic here
    setTimeout(() => setIsNotifying(false), 2000);
  };

  return (
      <div className="min-h-screen bg-white">
        <Header locale={locale} dict={{}} /> {/* Pass empty object for dict or implement dict fetching */}

        {/* Hero Section */}
        <section className="relative h-[500px] bg-[url('/images/agriculture-bg.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                Apply by completing our
                <br />
                <span className="text-[#FDB022]">online application</span>
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                Join our fellowship program and become part of Africa's next generation of leaders in sustainable development
              </motion.p>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <div className="bg-gradient-to-r from-[#FDB022] to-[#FFC53D] py-8">
          <Container>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[#045F3C] font-semibold text-lg">Stay connected for updates via social media.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[#045F3C] hover:text-[#034830] transition-colors hover:scale-110 transform">
                  <Twitter className="w-7 h-7" />
                </a>
                <a href="#" className="text-[#045F3C] hover:text-[#034830] transition-colors hover:scale-110 transform">
                  <Linkedin className="w-7 h-7" />
                </a>
                <a href="#" className="text-[#045F3C] hover:text-[#034830] transition-colors hover:scale-110 transform">
                  <Mail className="w-7 h-7" />
                </a>
                <a href="#" className="text-[#045F3C] hover:text-[#034830] transition-colors hover:scale-110 transform">
                  <Phone className="w-7 h-7" />
                </a>
              </div>
            </div>
          </Container>
        </div>

        {/* Application Status Section */}
        <section className="relative py-20 bg-[url('/images/pattern-bg.png')] bg-repeat">
          <div className="absolute inset-0 bg-white/80"></div>
          <Container className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <p className="font-medium">Applications are currently closed</p>
              </div>
              <p className="mt-6 text-gray-600 text-lg">
                Click here to be notified when the next Cohort opens, for now,
                <br />The Application is <span className="text-red-600 font-medium">closed</span>.
              </p>
              <Button
                  onClick={handleNotifyMe}
                  className="mt-8 bg-[#045F3C] hover:bg-[#034830] text-white px-10 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isNotifying ? 'Notifying...' : 'NOTIFY ME'}
              </Button>
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">What To Expect</h2>

              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[28px] top-0 bottom-0 w-1 bg-gradient-to-b from-[#FDB022] to-[#045F3C]"></div>

                {/* Timeline Items */}
                {applicationSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 }}
                        className="flex gap-8 mb-16 relative"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#045F3C] to-[#00A15D] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 z-10 shadow-lg">
                        {step.id}
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold text-[#045F3C] mb-3">{step.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Eligibility Section */}
        <section className="relative py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="absolute inset-0 bg-[url('/images/dots-pattern.png')] opacity-5"></div>
          <Container className="relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Eligibility</h2>
                <p className="text-gray-600 text-lg">Requirements for the GanzAfrica Fellowship Program</p>
              </div>
              <div className="bg-white rounded-2xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="space-y-8">
                  {eligibilityCriteria.map((criteria, index) => (
                      <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 }}
                          className="flex items-start gap-6 relative"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-full bg-[#FDB022]/10 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-[#FDB022]"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-[#045F3C] mb-3">{criteria.title}</h3>
                          <p className="text-gray-600 text-lg leading-relaxed">{criteria.description}</p>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Fellowship Journey Section */}
        <div className="bg-[#FFF9DB] py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-5xl font-bold text-[#045F3C] relative inline-block tracking-tight">
                FELLOW JOURNEY
                <div className="absolute -bottom-4 left-0 w-[90%] h-1.5 bg-[#FDB022]"></div>
              </h2>
            </div>

            <div className="relative mt-24">
              {/* Journey Steps Container */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 gap-y-16 relative">
                {/* Step 1 */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0 }}
                >
                  <motion.p
                      className="text-[#045F3C] text-center mb-8 h-20 text-lg max-w-[280px] font-medium"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    High-achieving young professionals are recruited as GanzAfrica fellows
                  </motion.p>
                  <motion.div
                      className="w-28 h-28 rounded-full bg-[#FDB022] flex items-center justify-center relative z-10 shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                  >
                    <Users2 className="w-14 h-14 text-white" />
                  </motion.div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.p
                      className="text-[#045F3C] text-center mb-8 h-20 text-lg max-w-[280px] font-medium"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    GanzAfrica Academy provides capacity building on data-led approaches and leadership
                  </motion.p>
                  <motion.div
                      className="w-28 h-28 rounded-full bg-[#0000CC] flex items-center justify-center relative z-10 shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.7 }}
                  >
                    <Blocks className="w-14 h-14 text-white" />
                  </motion.div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <motion.p
                      className="text-[#045F3C] text-center mb-8 h-20 text-lg max-w-[280px] font-medium"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    Fellows are placed in public institutions and empowered to shape policy approaches
                  </motion.p>
                  <motion.div
                      className="w-28 h-28 rounded-full bg-[#00A15D] flex items-center justify-center relative z-10 shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
                  >
                    <Briefcase className="w-14 h-14 text-white" />
                  </motion.div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.p
                      className="text-[#045F3C] text-center mb-8 h-20 text-lg max-w-[280px] font-medium"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    Fellows receive mentorship from experts, advancing their careers, leadership skills, and providing ongoing support
                  </motion.p>
                  <motion.div
                      className="w-28 h-28 rounded-full bg-[#045F3C] flex items-center justify-center relative z-10 shadow-lg"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.3 }}
                  >
                    <Users className="w-14 h-14 text-white" />
                  </motion.div>
                </motion.div>

                {/* Mobile Vertical Lines */}
                <div className="lg:hidden absolute left-1/2 top-[120px] bottom-0 w-0.5 bg-[#045F3C]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}