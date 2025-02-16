import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Leaf, Send } from "lucide-react";
import { safeAccess } from "@/lib/utils/safeAccess";
import { default as HeaderBelt } from "@/components/layout/headerBelt";

interface ContactUsContentProps {
    dict: any;
}

const ContactUsContent: React.FC<ContactUsContentProps> = ({ dict }) => {
    const [formState, setFormState] = React.useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formState);
        setFormState({ name: "", email: "", phone: "", message: "" });
    };

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Newsletter submitted");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section with Background Image */}
            <div className="relative h-[500px]"
                 style={{
                     backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
                     backgroundSize: 'cover',
                     backgroundPosition: 'center'
                 }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {/* Header with cut-out sections */}
                <header className="relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo section with white background cut-out */}
                            <div className="relative bg-white p-4 -ml-4 rounded-br-3xl">
                                <div className="flex items-center">
                                    <Leaf className="h-8 w-8 text-emerald-600" />
                                    <span className="ml-2 text-xl font-bold text-emerald-600">GanzAfrica</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center h-full text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Get in <span className="text-yellow-400">Touch</span> With Our<br />
                            Team Today
                        </h1>
                        <div className="text-6xl font-bold text-yellow-400">Contact Us</div>
                    </div>
                </div>
            </div>
            <HeaderBelt />


            {/* Contact Form and Newsletter Section */}
            <div className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Contact Form */}

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-4">
                                <span className="text-primary-green">Connect </span>
                                <span className="text-yellow-500">With Us</span>
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formState.email}
                                        onChange={handleChange}
                                        placeholder={safeAccess(dict, 'contact.form_email', "Email")}
                                        className="w-full bg-white border-2 border-gray-300 rounded-full px-5 py-4 h-12 font-medium-small"
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formState.phone}
                                        onChange={handleChange}
                                        placeholder={safeAccess(dict, 'contact.form_phone', "Phone")}
                                        className="w-full bg-white border-2 border-gray-300 rounded-full px-5 py-4 h-12 font-medium-small"
                                    />
                                </div>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    placeholder={safeAccess(dict, 'contact.form_name', "Name")}
                                    className="w-full bg-white border-2 border-gray-300 rounded-full px-5 py-4 h-12 font-medium-small"
                                    required
                                />
                                <Textarea
                                    name="message"
                                    value={formState.message}
                                    onChange={handleChange}
                                    placeholder={safeAccess(dict, 'contact.form_message', "Message")}
                                    className="w-full h-40 bg-white border-2 border-gray-300 rounded-3xl px-5 py-4 font-medium-small"
                                    required
                                />
                                <div>
                                    <Button
                                        type="submit"
                                        className="bg-primary-orange hover:bg-secondary-green text-white px-8 py-2 h-12 rounded-full font-bold-caption flex items-center gap-2"
                                    >
                                        {safeAccess(dict, 'contact.submit', "Submit Button")}
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Newsletter Form */}
                        <div className="lg:w-1/3 bg-primary-green rounded-lg p-8 text-white">
                            <h3 className="font-h4 mb-4">
                                {safeAccess(dict, 'contact.newsletter', "Our Newsletters")}
                            </h3>
                            <p className="mb-6 font-regular-paragraph">
                                {safeAccess(dict, 'contact.newsletter_desc',
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.")}
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-white border-2 border-gray-300 rounded-full px-5 py-4 h-12 text-dark font-medium-small"
                                    required
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-primary-orange hover:bg-dark text-white py-2 rounded-full h-12 font-bold-caption"
                                >
                                    {safeAccess(dict, 'contact.submit', "Submit Button")}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information Cards */}
            <div className="py-10 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Phone */}
                        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex items-start">
                            <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-full mr-4">
                                <Phone className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-600 mb-1">Call Us</h3>
                                <p className="text-gray-800 font-medium">(+250) 7876534</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Mon-Fri from 8am to 5pm
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex items-start">
                            <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-full mr-4">
                                <Mail className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-600 mb-1">Email Us</h3>
                                <p className="text-gray-800 font-medium">shemachristia@ganzafrica.id</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    We'll respond as soon as possible
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 flex items-start">
                            <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-full mr-4">
                                <MapPin className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-emerald-600 mb-1">Visit Us</h3>
                                <p className="text-gray-800 font-medium">Kigali, Rwanda</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    KN 5 Rd, Kigali Business Center
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="py-2 bg-white">
                <div className="container mx-auto px-4">
                    <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-300 relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5080550483483!2d30.053!3d-1.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTYnNDQuNCJTIDMwwrAwMycxMC44IkU!5e0!3m2!1sen!2sus!4v1616434174542!5m2!1sen!2sus&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="GanzAfrica Location"
                        ></iframe>

                    </div>
                    {/* Box Positioned on Top of Red Pin */}
                    <div
                        className="absolute z-10"
                        style={{
                            top: '70%',
                            left: '50%',
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div className="bg-white p-3 rounded-lg shadow-md border-2 border-emerald-600">
                            <div className="flex items-center">
                                <div className="bg-red-500 p-2 rounded-full mr-2">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-600">GanzAfrica</p>
                                    <p className="text-xs text-gray-700">27 House, KG 594 St, Kigali</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-4 h-4 bg-emerald-600 rotate-45 mx-auto -mt-2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUsContent;
