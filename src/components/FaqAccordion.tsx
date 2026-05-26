import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

interface IFaqItem {
  question: string;
  answer: string;
}

const faqs: IFaqItem[] = [
  {
    question: "Who can become a member?",
    answer: "Membership is open to all veterinarians, including serving, retired, and student categories, provided they meet the basic requirement of holding a recognized veterinary qualification.",
  },
  {
    question: "How do I apply for membership?",
    answer: "You can apply for membership online through our 'Become a Member' page or by contacting your district representative. You will need to submit proof of qualification and the required fee.",
  },
  {
    question: "Are there membership fees?",
    answer: "Yes, there is an annual or lifetime subscription fee depending on the membership category chosen. Student and retired members often qualify for reduced rates. Please check the membership page for current fees. Contact us for more information.",
  },
  {
    question: "What is the registration number of AVD?",
    answer: "AVD is a professional association of veterinarians, registered as a society under the West Bengal Societies Registration Act, 1961. The registration number is 34784.",
  }
];

export function FaqAccordion() {
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3">
        {faqs.map((faq, index) => (
          <FaqItem key={index} faq={faq} />
        ))}
      </div>
    </div>
  );
}

const FaqItem: React.FC<{ faq: IFaqItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 200);
    }
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        "flex flex-col border rounded-xl transition-all duration-200 group",
        isOpen ? "bg-slate-50 border-saffron-200 shadow-sm" : "bg-white border-slate-200 hover:border-saffron-200 hover:shadow-sm"
      )}>
      <button
        onClick={toggleOpen}
        className="w-full text-left p-4 sm:p-5 flex justify-between items-center cursor-pointer transition-colors"
        aria-expanded={isOpen}
      >
        <span className={cn(
          "text-base font-semibold transition-colors",
          isOpen ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
        )}>
          {faq.question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-200", 
            isOpen ? "text-saffron-600 -rotate-180" : "text-slate-400 group-hover:text-saffron-500"
          )}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-sm text-slate-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
