'use client';
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css"
//import "@/styles/main.css";

export default function TechStackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden ">
      <div className="pt-24 pb-20">
        {children}
      </div>
    </div>
  );
}
