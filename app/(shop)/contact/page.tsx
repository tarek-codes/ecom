import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { STORE_CONFIG } from "@/lib/constants/config";
import { ContactForm } from "@/components/shop/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Custom Orders",
  description:
    "Get in touch with Resin & Paper Craft for order updates, custom craft requests, and questions.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B85D3B] block">
          Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#2D231E]">
          We would love to hear from you.
        </h1>
        <p className="text-sm text-[#6B5C52] leading-relaxed">
          Have a question about a handmade product, want to request custom botanical colors, or need assistance with your Cash on Delivery order?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl border border-[#EADBCE] p-8 shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-medium text-[#2D231E] border-b border-[#F3ECE2] pb-4">
            Studio Information
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-[#6B5C52]">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B85D3B] border border-[#EADBCE] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[#2D231E] block">Phone / WhatsApp</span>
                <p className="mt-0.5">{STORE_CONFIG.contact.phone}</p>
                <p className="text-[11px] text-[#8A7B70] mt-0.5">Available for calls and messages</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B85D3B] border border-[#EADBCE] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[#2D231E] block">Email Inquiries</span>
                <p className="mt-0.5">{STORE_CONFIG.contact.email}</p>
                <p className="text-[11px] text-[#8A7B70] mt-0.5">We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B85D3B] border border-[#EADBCE] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[#2D231E] block">Workshop Address</span>
                <p className="mt-0.5">{STORE_CONFIG.contact.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B85D3B] border border-[#EADBCE] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[#2D231E] block">Studio Hours</span>
                <p className="mt-0.5">{STORE_CONFIG.contact.hours}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F3ECE2]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8A7B70] mb-3">
              Social Media Placeholders
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] text-[#6B5C52]">
                Instagram: {STORE_CONFIG.contact.instagram}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#EADBCE] text-[#6B5C52]">
                Facebook: {STORE_CONFIG.contact.facebook}
              </span>
            </div>
          </div>
        </div>

        {/* Message / Inquiry Form Component */}
        <ContactForm />
      </div>
    </div>
  );
}
