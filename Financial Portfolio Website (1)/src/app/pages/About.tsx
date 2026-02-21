import { Mail, Github } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const team = [
  {
    name: 'Rohan Das',
    role: 'Full Stack Developer',
    bio: 'Backend architecture, database design, and API development.',
  },
  {
    name: 'Tarun Muddana',
    role: 'Full Stack Developer',
    bio: 'Frontend development, UI/UX design, and user experience.',
  },
  {
    name: 'Kridhaay',
    role: 'Full Stack Developer',
    bio: 'Integration, testing, and deployment infrastructure.',
  },
];

const values = [
  {
    title: 'Learning by Doing',
    description: 'Building real-world applications to understand full-stack development from the ground up.',
  },
  {
    title: 'Open Source',
    description: 'Creating tools that others can learn from and contribute to, fostering community growth.',
  },
  {
    title: 'User-Centric',
    description: 'Designing with real user needs in mind, not just following trends or conventions.',
  },
  {
    title: 'Innovation',
    description: 'Exploring modern technologies and design patterns to build better financial tools.',
  },
];

export function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-6xl tracking-tight mb-6">About ApexFolio</h1>
          <p className="text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            A full-stack portfolio management platform built by students, for students and everyday investors.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <div className="space-y-6">
            <h2 className="text-4xl tracking-tight">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ApexFolio started as a Full Stack Application Development (FSAD) course project in 2026. Three students came together with a shared vision: build a portfolio management tool that doesn't treat users like corporate clients.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Traditional portfolio platforms are either too complex or too simple. We wanted something in between—powerful analytics for those who want them, but clean and accessible for everyone else.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              What started as a class project evolved into a fully functional platform with real authentication, database integration, 3D interactions, and comprehensive portfolio tracking features.
            </p>
          </div>
          <div className="h-[500px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHdvcmtpbmclMjB0b2dldGhlcnxlbnwxfHx8fDE3NzEwODY1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Students working together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-32">
          <h2 className="text-4xl tracking-tight mb-16">What We Believe In</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="border border-border p-10 space-y-4">
                <h3 className="text-2xl tracking-tight">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-32">
          <h2 className="text-4xl tracking-tight mb-16">The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member) => (
              <div key={member.name} className="space-y-4">
                <div className="h-80 bg-muted border border-border" />
                <div>
                  <h3 className="text-2xl tracking-tight mb-1">{member.name}</h3>
                  <div className="text-sm text-muted-foreground mb-3 tracking-wide">{member.role}</div>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="border-y border-border py-20 mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-2">
              <div className="text-5xl tracking-tight">2026</div>
              <div className="text-sm text-muted-foreground tracking-wide">Started</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl tracking-tight">3</div>
              <div className="text-sm text-muted-foreground tracking-wide">Team Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl tracking-tight">FSAD</div>
              <div className="text-sm text-muted-foreground tracking-wide">Course Project</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl tracking-tight">Open</div>
              <div className="text-sm text-muted-foreground tracking-wide">Source</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border border-border">
          <div className="p-12 border-b border-border">
            <h2 className="text-4xl tracking-tight">Get in Touch</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 space-y-8 border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-start space-x-4">
                <Mail size={24} className="text-muted-foreground mt-1" />
                <div>
                  <div className="mb-1 tracking-tight">Email</div>
                  <div className="text-muted-foreground">apexfolio.fsad@gmail.com</div>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Github size={24} className="text-muted-foreground mt-1" />
                <div>
                  <div className="mb-1 tracking-tight">GitHub</div>
                  <div className="text-muted-foreground">github.com/apexfolio</div>
                </div>
              </div>
            </div>
            <div className="p-12">
              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wide">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wide">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wide">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}