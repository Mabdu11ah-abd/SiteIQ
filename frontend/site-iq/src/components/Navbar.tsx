'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
// Import Clerk's useUser hook and SignOutButton
import { useUser, SignOutButton } from "@clerk/nextjs";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get the user's authentication status from Clerk
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-500 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center transform transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold">
              Site<span className="text-accent">IQ</span>
            </h1>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li className="relative group">
                <Link
                  href="/"
                  className="font-medium hover:text-accent transition-colors cursor-pointer"
                >
                  SITEIQ
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link
                  href="/features"
                  className="font-medium hover:text-accent transition-colors cursor-pointer"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link
                  href="/pricing"
                  className="font-medium hover:text-accent transition-colors cursor-pointer"
                >
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li className="relative group">
                <Link
                  href="/aboutus"
                  className="font-medium hover:text-accent transition-colors cursor-pointer"
                >
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              {isSignedIn && ( // Conditionally render User Dashboard link if signed in
                <li className="relative group">
                  <Link
                    href="/user-dashboard" // Link to user dashboard
                    className="font-medium hover:text-accent transition-colors cursor-pointer"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {isSignedIn ? (
              // If user is signed in, show Logout button
              <SignOutButton>
                <Button
                  variant="outline"
                  className="flex hover:border-accent hover:text-accent hover:bg-transparent transition-all cursor-pointer"
                >
                  Logout
                </Button>
              </SignOutButton>
            ) : (
              // If user is not signed in, show Login and Get Started buttons
              <>
                <Button
                  variant="outline"
                  className="flex hover:border-accent hover:text-accent hover:bg-transparent transition-all cursor-pointer"
                  asChild
                >
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button className="gradient-bg relative overflow-hidden group hidden sm:flex" asChild>
                  <Link href="/sign-up">
                    <span className="relative z-10">Get Started</span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  </Link>
                </Button>
              </>
            )}

            <button
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-[72px] left-0 right-0 transform transition-all duration-300 ease-in-out cursor-click ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 shadow-lg">
          <nav className="flex flex-col space-y-4 py-3">
            <Link
              href="/"
              className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              SITEIQ
            </Link>
            <Link
              href="/features"
              className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/aboutus"
              className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            {/* Conditional rendering for mobile menu Login/Logout */}
            {isSignedIn ? (
              <SignOutButton>
                <span // Use a span or div to make it clickable and style it like a link
                  className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Logout
                </span>
              </SignOutButton>
            ) : (
              <Link
                href="/sign-in"
                className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            {isSignedIn && ( // Conditionally render User Dashboard link in mobile menu if signed in
              <Link
                href="/user-dashboard"
                className="font-medium hover:text-accent transition-colors py-2 transform hover:translate-x-2 duration-200 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
