import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">
              Terms of Service
            </h1>
            <p className="text-subtext mb-8">Last updated: January 2, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-foreground/80 mb-4">
                  By accessing or using Vouchy ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  2. Description of Service
                </h2>
                <p className="text-foreground/80 mb-4">
                  Vouchy provides a platform for collecting, managing, and displaying customer testimonials. Our services include:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                  <li>Collection forms for video and text testimonials</li>
                  <li>Dashboard for managing and moderating testimonials</li>
                  <li>Embeddable widgets for showcasing testimonials</li>
                  <li>Analytics and reporting features</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  3. User Accounts
                </h2>
                <p className="text-foreground/80 mb-4">
                  You are responsible for safeguarding your account credentials and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  4. User Content
                </h2>
                <p className="text-foreground/80 mb-4">
                  You retain ownership of content you submit through our Service. By submitting content, you grant Vouchy a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content for the purpose of providing our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  5. Prohibited Uses
                </h2>
                <p className="text-foreground/80 mb-4">
                  You agree not to:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Submit false or misleading testimonials</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated means to access the Service without permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  6. Payment Terms
                </h2>
                <p className="text-foreground/80 mb-4">
                  Paid subscriptions are billed in advance on a monthly or annual basis. Refunds are available within 14 days of purchase if you're not satisfied with the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  7. Termination
                </h2>
                <p className="text-foreground/80 mb-4">
                  We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will cease immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-foreground/80 mb-4">
                  In no event shall Vouchy be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, or goodwill.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  9. Contact Us
                </h2>
                <p className="text-foreground/80">
                  If you have any questions about these Terms, please contact us at support@vouchy.app
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
