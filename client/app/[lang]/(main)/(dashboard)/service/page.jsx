// pages/services.js
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Gavel, Users, ArrowRight, Search, AlertCircle, Check } from "lucide-react";
import Image from "next/image";

export default function ServicesPage() {
  // State for case status form
  const [caseId, setCaseId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle case status search
  const handleCaseStatusSearch = async (e) => {
    e.preventDefault();
    
    if (!caseId || !captcha) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - replace with actual API integration
      setStatusResult({
        caseNumber: caseId,
        status: "In Progress",
        lastUpdated: "February 28, 2025",
        nextHearing: "March 15, 2025",
        assignedTo: "Attorney Jane Smith",
        notes: "Discovery documents received, preparing response"
      });
    } catch (err) {
      setError("Unable to retrieve case information. Please verify your case ID and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset status search
  const resetCaseSearch = () => {
    setCaseId("");
    setCaptcha("");
    setStatusResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-background py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">Legal Services</h1>
          <div className="h-1 w-24 bg-orange-400 mx-auto mb-6"></div>
          <p className="text-xl text-foreground">
            Committed to providing accessible legal assistance through various
            service options tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Legal Clinics Card */}
          <Card className="overflow-hidden shadow-lg border-tan-200 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-primary text-primary-foreground border-b border-tan-300">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Legal Clinics</CardTitle>
              </div>
              <CardDescription className="text-cream-50">
                Free assistance on common legal issues
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-cream-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">Upcoming Clinics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-orange-400" />
                    <div>
                      <span className="font-medium">Housing Rights Clinic</span>
                      <p className="text-sm text-muted-foreground">Every Tuesday, 4-7 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-orange-400" />
                    <div>
                      <span className="font-medium">Family Law Clinic</span>
                      <p className="text-sm text-muted-foreground">First Saturday Monthly, 10 AM-1 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-orange-400" />
                    <div>
                      <span className="font-medium">Immigration Clinic</span>
                      <p className="text-sm text-muted-foreground">Third Thursday Monthly, 5-8 PM</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-cream-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">Services Offered</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Brief legal advice and consultation
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Document review and assistance
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Referrals to specialized legal services
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Know-your-rights information
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-primary hover:bg-orange-500 text-primary-foreground py-6">
                Register for a Legal Clinic
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Bono Card */}
          <Card className="overflow-hidden shadow-lg border-tan-200 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-primary text-primary-foreground border-b border-tan-300">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Gavel className="h-6 w-6" />
                </div>
                <CardTitle>Pro Bono Representation</CardTitle>
              </div>
              <CardDescription className="text-cream-50">
                Full representation at no cost for qualifying clients
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-cream-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Income below 200% of federal poverty guidelines
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Residency in our service area
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Case falls within our priority areas
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Limited or no access to legal resources
                  </li>
                </ul>
              </div>
              
              <div className="bg-cream-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">Practice Areas</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Domestic violence & family safety
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Housing & eviction defense
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Public benefits & healthcare access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Immigration & asylum
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-primary hover:bg-orange-500 text-primary-foreground py-6">
                Apply for Pro Bono Representation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Legal Consultations Card */}
          <Card className="overflow-hidden shadow-lg border-tan-200 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-primary text-primary-foreground border-b border-tan-300">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <CardTitle>Legal Consultations</CardTitle>
              </div>
              <CardDescription className="text-cream-50">
                One-on-one sessions with experienced attorneys
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-cream-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">Consultation Options</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-orange-400" />
                    <div>
                      <span className="font-medium">30-minute initial consultation</span>
                      <p className="text-sm text-muted-foreground">$50</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-orange-400" />
                    <div>
                      <span className="font-medium">60-minute comprehensive consultation</span>
                      <p className="text-sm text-muted-foreground">$95</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-orange-400" />
                    <div>
                      <span className="font-medium">Virtual consultations available</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-cream-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">Areas of Expertise</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Business law
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Employment law
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Personal injury
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-orange-400" />
                    Estate planning
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-primary hover:bg-orange-500 text-primary-foreground py-6">
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Case Status Card */}
          <Card className="overflow-hidden shadow-lg border-tan-200 hover:shadow-xl transition-shadow">
            <CardHeader className="bg-primary text-primary-foreground border-b border-tan-300">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Search className="h-6 w-6" />
                </div>
                <CardTitle>Case Status Lookup</CardTitle>
              </div>
              <CardDescription className="text-cream-50">
                Check the current status of your legal case
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!statusResult ? (
                <form onSubmit={handleCaseStatusSearch} className="space-y-6">
                  <div className="bg-cream-50 rounded-lg p-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="caseId" className="text-primary font-medium">
                        Case ID Number
                      </Label>
                      <Input
                        id="caseId"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        placeholder="Enter your case ID (e.g., ABC-12345)"
                        className="border-tan-200 focus:border-orange-400 focus:ring-orange-400"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="captcha" className="text-primary font-medium">
                        Security Code
                      </Label>
                      <div className="grid grid-cols-5 gap-4">
                        <div className="col-span-3">
                          <Input
                            id="captcha"
                            value={captcha}
                            onChange={(e) => setCaptcha(e.target.value)}
                            placeholder="Enter the code shown"
                            className="border-tan-200 focus:border-orange-400 focus:ring-orange-400"
                            required
                          />
                        </div>
                        <div className="col-span-2 bg-muted border rounded-md flex items-center justify-center">
                          {/* Mock captcha image */}
                          <span className="text-muted-foreground font-mono tracking-widest font-bold">4G9K2Z</span>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Case information is updated daily by 5:00 PM.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-orange-500 text-primary-foreground py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Looking Up Case...
                      </>
                    ) : (
                      <>
                        Check Case Status
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-tan-100 border border-tan-200 rounded-lg p-4 flex items-center">
                    <Check className="h-5 w-5 text-orange-400 mr-2" />
                    <span className="text-primary">Case found! See status information below.</span>
                  </div>
                  
                  <div className="bg-cream-50 rounded-lg overflow-hidden">
                    <div className="bg-primary text-primary-foreground p-4">
                      <h3 className="text-xl font-bold">Case #{statusResult.caseNumber}</h3>
                      <p className="text-cream-100">Last Updated: {statusResult.lastUpdated}</p>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Status</p>
                          <p className="font-semibold text-primary">{statusResult.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Hearing Date</p>
                          <p className="font-semibold text-primary">{statusResult.nextHearing}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Assigned Attorney</p>
                          <p className="font-semibold text-primary">{statusResult.assignedTo}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Case Notes</p>
                        <p className="text-foreground mt-1">{statusResult.notes}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      className="flex-1 bg-muted hover:bg-tan-200 text-foreground"
                      onClick={resetCaseSearch}
                    >
                      Look Up Another Case
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-orange-500 text-primary-foreground">
                      Contact Attorney
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}