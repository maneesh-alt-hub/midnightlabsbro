import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SectionTitle } from '../ui/SectionTitle';

export const Contact = () => {
  return (
    <section className="py-24 px-4 md:px-6 bg-brand-cream relative border-t-2 border-brand-ink" id="contact">
      <div className="max-w-2xl mx-auto">
        <SectionTitle subtitle="GET IN TOUCH" className="text-center">LET'S CONNECT</SectionTitle>
        <Card className="p-8 md:p-12 neo-shadow-lg relative">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest block text-brand-ink">NAME</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full neo-border p-4 focus:bg-brand-sand outline-none font-medium transition-all bg-white hover:border-brand-primary text-brand-ink"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest block text-brand-ink">EMAIL</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="w-full neo-border p-4 focus:bg-brand-sand outline-none font-medium transition-all bg-white hover:border-brand-primary text-brand-ink"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest block text-brand-ink">MESSAGE</label>
              <textarea 
                rows={4}
                placeholder="How can we help you automate?"
                className="w-full neo-border p-4 focus:bg-brand-sand outline-none font-medium transition-all bg-white resize-none hover:border-brand-primary text-brand-ink"
              ></textarea>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="flex-1">Send Message</Button>
              <Button variant="outline" className="flex items-center gap-2 justify-center">
                <MessageSquare size={20} />
                Chat on WhatsApp
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};
