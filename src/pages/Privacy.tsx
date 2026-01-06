import { motion } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
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
              Privacy Policy
            </h1>
            <p className="text-subtext mb-8">Last updated: January 2, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-foreground/80 mb-4">
                  We collect information you provide directly to us, such as when you create an account, submit testimonials, or contact us for support.
                </p>
                <h3 className="text-lg font-medium text-primary mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                  <li>Name and email address</li>
                  <li>Company name and job title</li>
                  <li>Profile photos and avatars</li>
                  <li>Video and text testimonial content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-foreground/80 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to improve user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-foreground/80 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following situations:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                  <li>With your consent or at your direction</li>
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  4. Data Security
                </h2>
                <p className="text-foreground/80 mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  5. Data Retention
                </h2>
                <p className="text-foreground/80 mb-4">
                  We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your data at any time by contacting us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  6. Your Rights
                </h2>
                <p className="text-foreground/80 mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                  <li>Access and receive a copy of your data</li>
                  <li>Rectify inaccurate personal data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  7. Cookies
                </h2>
                <p className="text-foreground/80 mb-4">
                  We use cookies and similar tracking technologies to collect and track information about your usage of our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  8. Children's Privacy
                </h2>
                <p className="text-foreground/80 mb-4">
                  Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  9. Changes to This Policy
                </h2>
                <p className="text-foreground/80 mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  10. Contact Us
                </h2>
                <p className="text-foreground/80">
                  If you have questions about this Privacy Policy, please contact us at privacy@vouchy.app
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

export default Privacy;
