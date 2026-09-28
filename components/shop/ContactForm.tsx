"use client";

import React, { useState } from "react";
import { MessageSquare, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-[#EADBCE] p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="font-serif text-xl font-medium text-[#2D231E]">
          Message Sent!
        </h3>
        <p className="text-xs text-[#6B5C52] leading-relaxed max-w-sm mx-auto">
          Thank you for reaching out to our studio. We have received your inquiry and will reply via email or phone within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs font-semibold text-[#B85D3B] hover:underline pt-2"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EADBCE] p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-[#F3ECE2] pb-4">
        <MessageSquare className="w-5 h-5 text-[#B85D3B]" />
        <h2 className="font-serif text-xl font-medium text-[#2D231E]">
          Send a Note or Custom Request
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
            Your Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Maria Khan"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
            Phone or Email *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. maria@example.com or 01700..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
            Subject
          </label>
          <select className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]">
            <option>Custom Handcrafted Gift Inquiry</option>
            <option>Order Status / Delivery Question</option>
            <option>Bulk / Wedding Favor Request</option>
            <option>General Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2D231E] mb-1.5">
            Your Message *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Tell us what you have in mind..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#EADBCE] bg-[#FAF7F2] text-xs sm:text-sm text-[#2D231E] focus:outline-none focus:border-[#B85D3B]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 rounded-xl bg-[#B85D3B] hover:bg-[#9E4B2C] text-white font-medium text-xs sm:text-sm transition-all shadow-sm"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
