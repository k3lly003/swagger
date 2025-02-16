"use client";

import { useState } from 'react';
import { Search, Book, Mail, Phone, MessageSquare, FileText, ChevronRight, ExternalLink, Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const sections: HelpSection[] = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about using the platform',
    icon: HelpCircle,
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Detailed guides and documentation for all features',
    icon: Book,
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Get help from our support team',
    icon: MessageCircle,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with our team',
    icon: Mail,
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I create a new article?',
    answer: 'To create a new article, navigate to the News section and click on the "Add News" button. Fill in the required fields including title, content, and any featured images. You can preview your article before publishing.',
  },
  {
    question: 'How do I manage my account settings?',
    answer: 'You can manage your account settings by clicking on the Settings icon in the sidebar. Here you can update your profile information, change your password, and customize your notification preferences.',
  },
  {
    question: 'What file types are supported for image uploads?',
    answer: 'We support JPEG, PNG, and GIF image formats. The maximum file size for uploads is 5MB.',
  },
  {
    question: 'How do I format my article content?',
    answer: 'The article editor provides rich text formatting options. You can use the toolbar to add headings, lists, links, and images. You can also use markdown syntax for quick formatting.',
  },
];

// FAQ Accordion Component
const FAQItemComponent = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = `faq-${question.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        className="w-full py-4 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded="false"
        {...(isOpen && { 'aria-expanded': 'true' })}
        aria-controls={id}
      >
        <span className="text-gray-800 font-medium">{question}</span>
        <span className="flex items-center justify-center w-6 h-6 rounded-full border border-green-600">
          {isOpen ? (
            <Minus className="w-4 h-4 text-green-600" aria-hidden="true" />
          ) : (
            <Plus className="w-4 h-4 text-green-600" aria-hidden="true" />
          )}
        </span>
      </button>
      {isOpen && (
        <div id={id} className="pb-4 text-gray-600" role="region">
          {answer}
        </div>
      )}
    </div>
  );
};

// Quick Links Component
const QuickLink = ({ icon: Icon, title, description, href }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  href: string;
}) => (
  <Link 
    href={href}
    className="block p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
  >
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-green-600" />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </Link>
);

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredFaqs(faqs);
      return;
    }

    const filtered = faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
    setFilteredFaqs(filtered);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'faq':
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search FAQs..."
                onChange={handleSearch}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  className={`w-full text-left p-4 flex justify-between items-center ${
                    expandedFAQ === faq.question ? 'bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <HelpCircle className={`w-5 h-5 transition-transform ${
                    expandedFAQ === faq.question ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedFAQ === faq.question && (
                  <div className="p-4 bg-white border-t">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'documentation':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-2">Getting Started Guide</h3>
                <p className="text-gray-600 text-sm">Learn the basics of using our platform</p>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-2">Content Management</h3>
                <p className="text-gray-600 text-sm">Learn how to create and manage content</p>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-2">User Management</h3>
                <p className="text-gray-600 text-sm">Understand user roles and permissions</p>
              </Card>
              <Card className="p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium mb-2">Advanced Features</h3>
                <p className="text-gray-600 text-sm">Explore advanced platform features</p>
              </Card>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Support Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM (CAT)</p>
              <p className="text-gray-600">Response time: Within 24 hours</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
                <button className="text-green-700 hover:text-green-800 font-medium">
                  Start Chat
                </button>
              </Card>
              <Card className="p-4">
                <h3 className="font-medium mb-2">Submit a Ticket</h3>
                <p className="text-gray-600 mb-4">Create a support ticket for detailed assistance</p>
                <button className="text-green-700 hover:text-green-800 font-medium">
                  Create Ticket
                </button>
              </Card>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-5 h-5 text-green-700" />
                  <h3 className="font-medium">Email</h3>
                </div>
                <p className="text-gray-600">support@example.com</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-5 h-5 text-green-700" />
                  <h3 className="font-medium">Phone</h3>
                </div>
                <p className="text-gray-600">+250 123 456 789</p>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="font-medium mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800"
                >
                  Send Message
                </button>
              </form>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers and get support for your questions</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for help articles..."
            className="pl-10"
            aria-label="Search help articles"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <QuickLink
          icon={Book}
          title="Getting Started Guide"
          description="Learn the basics of using the platform with our comprehensive guide"
          href="/help/getting-started"
        />
        <QuickLink
          icon={FileText}
          title="Documentation"
          description="Detailed documentation for all features and functionalities"
          href="/help/documentation"
        />
        <QuickLink
          icon={MessageSquare}
          title="Community Forum"
          description="Connect with other users and share your experiences"
          href="/help/forum"
        />
      </div>

      {/* Popular Topics */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-6">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Project Management", count: 12 },
            { title: "User Administration", count: 8 },
            { title: "Content Publishing", count: 15 },
            { title: "Reports & Analytics", count: 10 },
            { title: "Account Settings", count: 6 },
            { title: "Security & Privacy", count: 9 }
          ].map((topic, index) => (
            <Link
              key={index}
              href={`/help/topic/${topic.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{topic.title}</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <span>{topic.count} articles</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Card className="p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-green-50 text-green-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                {sections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-500">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
}
