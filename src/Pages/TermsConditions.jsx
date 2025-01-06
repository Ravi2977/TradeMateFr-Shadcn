import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/AuthContext/AuthContext";

function TermsConditions() {
      const {isTermsOpen, setIsTermsOpen} = useAuth();
      const {termStatus, setTermStatus} = useAuth();

      const agreeTerms =()=>{
        setIsTermsOpen(false)
        setTermStatus(true)
      }
    
  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Scrollable Terms Section */}
          <div className=" p-4">
            <section className="space-y-6">
              {/* Introduction */}
              <article>
                <h2 className="text-lg font-bold">Welcome to TradeMate</h2>
                <p>
                  These Terms and Conditions ("Terms") govern your use of the
                  TradeMate platform for subscription-based services. By using
                  this service, you agree to comply with these Terms.
                </p>
              </article>

              {/* Subscription Plans */}
              <article>
                <h2 className="text-lg font-bold">Subscription Plans</h2>
                <p>
                  TradeMate offers three subscription plans to suit your
                  business needs:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    <strong>Monthly Plan:</strong> Payments are charged monthly.
                  </li>
                  <li>
                    <strong>Half-Yearly Plan:</strong> Payments are charged once
                    every six months.
                  </li>
                  <li>
                    <strong>Annual Plan:</strong> Payments are charged once
                    every 12 months.
                  </li>
                </ul>
              </article>

              {/* Payment Terms */}
              <article>
                <h2 className="text-lg font-bold">Payment Terms</h2>
                <p>
                  Payments for subscriptions are processed securely through
                  Razorpay. By subscribing, you authorize recurring payments as
                  per your selected plan. Subscription charges are non-refundable
                  except under the conditions mentioned in the Refund Policy.
                </p>
              </article>

              {/* Refund Policy */}
              <article>
                <h2 className="text-lg font-bold">Refund Policy</h2>
                <p>
                  Refunds are only applicable under the following circumstances:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Duplicate payments due to a technical error will be refunded
                    within 7-10 business days.
                  </li>
                  <li>
                    Subscription cancellations are only eligible for refunds if
                    requested within 24 hours of payment.
                  </li>
                </ul>
                <p>
                  No refunds are provided for partial usage of subscription
                  services.
                </p>
              </article>

              {/* User Obligations */}
              <article>
                <h2 className="text-lg font-bold">User Obligations</h2>
                <p>
                  Users must ensure that all payment details provided are
                  accurate and that sufficient funds are available for payment
                  processing. Any violation of these Terms may result in the
                  termination of services.
                </p>
              </article>

              {/* Contact Information */}
              <article>
                <h2 className="text-lg font-bold">Contact Information</h2>
                <p>
                  If you have any questions or concerns about our terms,
                  subscription plans, or refund policy, feel free to contact us:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@trademate.com"
                      className="text-blue-500 underline"
                    >
                      trademate@ravicomputer.online
                    </a>
                  </li>
                  <li>
                    <strong>Phone:</strong> +91-8604285934
                  </li>
                  <li>
                    <strong>Address:</strong> 67, sainik road Chandwak, Dobhi, Kerakt, jaunpur 222129
                  </li>
                </ul>
              </article>
            </section>
          </div>

          {/* Agree Button */}
          <div className="mt-6 text-center">
            <Button
              className="w-full"
              onClick={agreeTerms}
            >
              I Agree
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TermsConditions;
