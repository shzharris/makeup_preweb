import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { 
  SparklesIcon, 
  HeartIcon, 
  InstagramIcon, 
  TwitterIcon, 
  FacebookIcon, 
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CrownIcon
} from "lucide-react";

export function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Makeup Analysis", href: "/makeup_analysis" },
    { name: "Discover Makeup", href: "/discover_makeup" },
    { name: "Price", href: "/?#pricing" }
  ];

  // const supportLinks = [
  //   { name: "Contact Support", href: "#contact" }
  // ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" }
  ];



  return (
    <footer className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border-t border-pink-200/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <CrownIcon className="w-8 h-8 text-pink-500" />
                <SparklesIcon className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Makeup Insight AI
                </h3>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed">
            Beauty, intelligently personalized.<br/>
            Upload a selfie to detect makeup issues and receive tailored suggestions. Opt-in to share with the community gallery for inspiration.
            </p>

            {/* Social Media */}
            {/* <div className="flex gap-3">
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-pink-300 text-pink-600 hover:bg-pink-50">
                <InstagramIcon className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-pink-300 text-pink-600 hover:bg-pink-50">
                <TwitterIcon className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="w-10 h-10 p-0 border-pink-300 text-pink-600 hover:bg-pink-50">
                <FacebookIcon className="w-4 h-4" />
              </Button>
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg text-pink-800 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-pink-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 rounded-full bg-pink-400 group-hover:bg-pink-600 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-lg text-pink-800 flex items-center gap-2">
              <HeartIcon className="w-4 h-4" />
              Support
            </h4>
            <ul className="space-y-3">
              <li  className="flex items-center gap-3 text-sm text-muted-foreground">
                <MailIcon className="w-4 h-4 text-pink-500" />
                <span>support@makeupinsight.us</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="text-lg text-pink-800 flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4" />
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-pink-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 rounded-full bg-rose-400 group-hover:bg-rose-600 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-pink-200/50" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground ">
            <span>© 2025 Black Flame Digital Service Co., Ltd.</span>
            <div className="w-1 h-1 rounded-full bg-pink-400" />
            <span>All rights reserved</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300" /> */}
    </footer>
  );
}