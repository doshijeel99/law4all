// pages/services.js
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Gavel, Users, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4 h-screen overflow-scroll">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Legal Services</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Committed to providing accessible legal assistance through various
          service options
        </p>
      </div>

      <Tabs defaultValue="legal-clinics" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="legal-clinics">Legal Clinics</TabsTrigger>
          <TabsTrigger value="pro-bono">Pro Bono Cases</TabsTrigger>
          <TabsTrigger value="consultations">Legal Consultations</TabsTrigger>
        </TabsList>

        {/* Legal Clinics Content */}
        <TabsContent value="legal-clinics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2" />
                Legal Clinics
              </CardTitle>
              <CardDescription>
                Free community-based legal clinics providing advice and
                assistance on common legal issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Upcoming Clinics
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>Housing Rights Clinic - Every Tuesday, 4-7 PM</span>
                    </li>
                    <li className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>
                        Family Law Clinic - First Saturday Monthly, 10 AM-1 PM
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      <span>
                        Immigration Clinic - Third Thursday Monthly, 5-8 PM
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Services Offered
                  </h3>
                  <ul className="space-y-2">
                    <li>Brief legal advice and consultation</li>
                    <li>Document review and assistance</li>
                    <li>Referrals to specialized legal services</li>
                    <li>Know-your-rights information</li>
                    <li>Language assistance available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Register for a Legal Clinic
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pro Bono Cases Content */}
        <TabsContent value="pro-bono">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gavel className="mr-2" />
                Pro Bono Cases
              </CardTitle>
              <CardDescription>
                Full representation at no cost for qualifying clients in select
                practice areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Eligibility Criteria
                  </h3>
                  <ul className="space-y-2">
                    <li>Income below 200% of federal poverty guidelines</li>
                    <li>Residency in our service area</li>
                    <li>Case falls within our priority areas</li>
                    <li>Limited or no access to legal resources</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Practice Areas</h3>
                  <ul className="space-y-2">
                    <li>Domestic violence & family safety</li>
                    <li>Housing & eviction defense</li>
                    <li>Public benefits & healthcare access</li>
                    <li>Consumer protection & debt relief</li>
                    <li>Immigration & asylum</li>
                  </ul>
                </div>
              </div>
              <div className="border rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-lg mb-2">
                  Application Process
                </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>Complete our online intake form</li>
                  <li>Attend initial screening appointment</li>
                  <li>Provide required documentation</li>
                  <li>Case review by our pro bono committee</li>
                  <li>Attorney assignment and representation agreement</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Apply for Pro Bono Representation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Legal Consultations Content */}
        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2" />
                Legal Consultations
              </CardTitle>
              <CardDescription>
                One-on-one consultations with experienced attorneys at reduced
                rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Consultation Options
                  </h3>
                  <ul className="space-y-2">
                    <li>30-minute initial consultation - $50</li>
                    <li>60-minute comprehensive consultation - $95</li>
                    <li>Virtual consultations available</li>
                    <li>Sliding scale fees for qualifying clients</li>
                    <li>Same-day appointments often available</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Areas of Expertise
                  </h3>
                  <ul className="space-y-2">
                    <li>Business law & contracts</li>
                    <li>Employment disputes</li>
                    <li>Personal injury claims</li>
                    <li>Estate planning & probate</li>
                    <li>Intellectual property</li>
                    <li>Criminal defense</li>
                  </ul>
                </div>
              </div>
              <div className="border rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-lg mb-2">What to Expect</h3>
                <p>
                  During your consultation, an attorney will review your legal
                  situation, explain your options, provide preliminary advice,
                  and outline potential next steps. You'll leave with a clear
                  understanding of your legal position and available pathways
                  forward.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
