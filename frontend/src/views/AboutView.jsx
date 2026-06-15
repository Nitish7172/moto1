import React from 'react';
import { Shield, Wrench, MapPin, Phone, Mail, Clock, Github, Linkedin, Twitter, Code2, Database, Terminal, Layers } from 'lucide-react';

// --- Configuration ---

const features = [
  {
    icon: Shield,
    title: "Trust & Legacy",
    desc: "15+ years of excellence and 50,000+ riders across India."
  },
  {
    icon: Wrench,
    title: "Expert Care",
    desc: "Our workshops are equipped with cutting-edge diagnostic tools and factory-trained pros."
  },
  {
    icon: MapPin,
    title: "Pan-India Reach",
    desc: "Showrooms and service centers in Mumbai, Delhi, Bangalore, and Chennai."
  }
];

// USE THIS ONLY IF DICEBEAR FAILS
const teamMembers = [
  {
    name: "Shiv Pratap Singh",
    role: "Frontend Developer",
    // Long hair / bun equivalent in this library
    image: "https://avatar.iran.liara.run/public/boy?username=Shiv", 
    bio: "Pixel-perfect architect ensuring the UI is as smooth as a fresh tarmac.",
    techIcon: Code2
  },
  {
    name: "Sonu Kumar Sah",
    role: "Backend Developer",
    image: "https://avatar.iran.liara.run/public/boy?username=Sonu",
    bio: "The engine master. Optimizing queries and API latencies for maximum torque.",
    techIcon: Database
  },
  {
    name: "Vishal Kumar",
    role: "Full Stack Developer",
    image: "https://avatar.iran.liara.run/public/boy?username=Vishal",
    bio: "Bridging the gap between server logic and client experience.",
    techIcon: Layers
  },
  {
    name: "Nitish Singh",
    role: "DevOps Engineer",
    image: "https://avatar.iran.liara.run/public/boy?username=Nitish",
    bio: "Keeping the infrastructure resilient and deployments automated.",
    techIcon: Terminal
  }
];

// --- Sub-Components ---

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 text-center transition-colors duration-300 border bg-neutral-900 rounded-2xl border-neutral-800 hover:border-orange-500/50">
    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-orange-500 rounded-full bg-neutral-800">
      <Icon size={32} />
    </div>
    <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

const TeamCard = ({ name, role, image, bio, techIcon: TechIcon }) => (
  <div className="relative overflow-hidden transition-all duration-300 border shadow-lg group bg-neutral-900 rounded-2xl border-neutral-800 hover:border-orange-500/50 hover:-translate-y-2">
    {/* Avatar Background Area */}
    <div className="relative flex items-end justify-center h-48 pt-8 overflow-hidden bg-neutral-800">
      {/* Abstract Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-neutral-900 to-neutral-900 opacity-50"></div>
      
      {/* Animated/Avatar Image */}
      <img 
        src={image} 
        alt={name} 
        className="relative z-10 object-contain w-40 h-40 transition-transform duration-500 drop-shadow-2xl group-hover:scale-110"
      />
    </div>
    
    {/* Card Content */}
    <div className="relative z-20 p-6">
        <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 text-xs font-semibold text-orange-500 border rounded-full bg-orange-500/10 border-orange-500/20">
                {role}
            </span>
            <TechIcon size={18} className="transition-colors text-neutral-500 group-hover:text-white"/>
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-white">{name}</h3>
        <p className="h-10 mb-6 text-sm text-gray-400 line-clamp-2">{bio}</p>
        
        {/* Social Links */}
        <div className="flex gap-4 pt-4 border-t border-neutral-800">
            <a href="#" className="text-gray-500 transition-colors hover:text-white"><Github size={18}/></a>
            <a href="#" className="text-gray-500 transition-colors hover:text-blue-500"><Linkedin size={18}/></a>
            <a href="#" className="text-gray-500 transition-colors hover:text-sky-400"><Twitter size={18}/></a>
        </div>
    </div>
  </div>
);

// --- Main Component ---

export default function AboutView() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* 1. Hero / Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">
            Born on the Track. <span className="text-orange-500">Raised on the Street.</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-400">
            MotoGears India was founded with a simple mission: bring world-class machines and seamless digital experiences to Indian riders.
          </p>
        </div>

        {/* 2. Features Grid */}
        <div className="grid gap-8 mb-24 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* 3. Team Section */}
        <div className="mb-24">
          <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Meet the Builders</h2>
              <p className="max-w-2xl mx-auto text-gray-400">
                The development squad powering the MotoGears platform.
              </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member, index) => (
                  <TeamCard key={index} {...member} />
              ))}
          </div>
        </div>

        {/* 4. Contact / Location */}
        <div className="flex flex-col items-center justify-between gap-8 p-8 border shadow-2xl bg-neutral-800 rounded-2xl md:p-12 md:flex-row border-neutral-700">
          <div className="w-full md:w-1/2">
            <h3 className="mb-2 text-2xl font-bold text-white">Visit our Flagship Store</h3>
            <address className="not-italic">
              <p className="mb-6 text-gray-400">12, MotoGears Avenue, Bandra West, Mumbai, Maharashtra 400050</p>
              <div className="space-y-4 text-gray-300">
                <a href="tel:+919876543210" className="flex items-center gap-3 transition-colors hover:text-orange-500">
                  <Phone size={20} className="text-orange-500" /> <span>+91 98765 43210</span>
                </a>
                <a href="mailto:contact@motogears.in" className="flex items-center gap-3 transition-colors hover:text-orange-500">
                  <Mail size={20} className="text-orange-500" /> <span>contact@motogears.in</span>
                </a>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-orange-500" /> <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
                </div>
              </div>
            </address>
          </div>
          <div className="relative w-full h-64 overflow-hidden md:w-1/2 md:h-80 rounded-xl">
             <img 
               src="https://images.unsplash.com/photo-1568772585482-009cda7582ba?auto=format&fit=crop&w=800&q=80" 
               className="object-cover w-full h-full transition-transform duration-700 hover:scale-105" 
               alt="MotoGears Mumbai Showroom" 
             />
          </div>
        </div>
      </div>
    </div>
  );
}
