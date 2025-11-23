"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqData = [
  {
    id: "item-1",
    question: "What sizing do you follow?",
    answer:
      "All Capella products use an oversized, relaxed streetwear fit. Check the size chart before ordering.",
  },
  {
    id: "item-2",
    question: "How do I know which size will fit me?",
    answer:
      "Use our size guide or message us with your height/weight — we will recommend the perfect fit.",
  },
  {
    id: "item-3",
    question: "Are Capella products unisex?",
    answer:
      "Yes. Every fit is designed to suit all genders and body types.",
  },
  {
    id: "item-4",
    question: "Are the colors exactly like the photos?",
    answer:
      "Yes — we shoot under controlled studio lighting for accurate color representation. Minor screen-based variations may occur.",
  },
  {
    id: "item-5",
    question: "What is your return policy?",
    answer:
      "Returns accepted within 14 days of delivery if the item is unused and in original condition. The refund will be credited only as Store Credits.",
  },
  {
    id: "item-6",
    question: "How long does delivery take?",
    answer:
      "Orders dispatch in 3 to 5 business days. Delivery time depends on your region.",
  },
  {
    id: "item-7",
    question: "Do you restock designs?",
    answer:
      "No. Every drop is limited — once it is sold out, it never returns.",
  },
  {
    id: "item-8",
    question: "Can I exchange for a different size?",
    answer:
      "Yes, if the size you want is available during the exchange request.",
  },
  {
    id: "item-9",
    question: "What should I do if my order arrives damaged?",
    answer:
      "Contact us within 48 hours with photos, and we will sort it out immediately.",
  },
  {
    id: "item-10",
    question: "Do you offer COD?",
    answer:
      "No. We only support secure online payments.",
  },
  {
    id: "item-11",
    question: "Do you offer gift packaging?",
    answer:
      "Yes, you can select gift packaging at checkout if available.",
  },
  {
    id: "item-12",
    question: "What material do you use?",
    answer:
      "We use premium fabrics with reinforced stitching for long-lasting comfort and structure.",
  },
]

export function FaqSection() {
  return (
    <section className="min-h-screen bg-[#f2efe8] px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* FAQ Title */}
          <div className="lg:col-span-4 xl:col-span-3">
            <h1 className="text-5xl font-light tracking-tight text-[#1a1c18] sm:text-6xl md:text-7xl lg:text-8xl sticky top-24">
              FAQ
            </h1>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-8 xl:col-span-9">
            <Accordion type="single" collapsible className="flex flex-col gap-4">
              {faqData.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border-none bg-[#ffffff] px-6 py-2 shadow-sm transition-shadow hover:shadow-md sm:px-8 sm:py-3"
                >
                  <AccordionTrigger className="text-left text-base font-normal text-[#1a1c18] hover:no-underline sm:text-lg [&[data-state=open]>svg]:rotate-45">
                    <span className="pr-4 leading-relaxed">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 text-sm leading-relaxed text-[#3e3e3e] sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}