"use client";
import React, { useEffect, useState } from "react";
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
import {
  CalendarDays,
  Gavel,
  Users,
  ArrowRight,
  Search,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import Image from "next/image";
import SmallLoader from "@/components/Misc/SmallLoader";

// Import the new CaseDetails component
import CaseDetails from "@/components/CaseDetails";
import { useRouter } from "next/navigation";

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-blue-200">
          <h2 className="text-2xl font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function ServicesPage() {
  // State for modals
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // State for case status form
  const [caseId, setCaseId] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [error, setError] = useState(null);
  const [captchaImage, setCaptchaImage] = useState("");
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get CAPTCHA
    const fetchCaptcha = async () => {
      setIsCaptchaLoading(true);
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCaptchaImage(data.captcha_base64);
      }
      setIsCaptchaLoading(false);
    };

    fetchCaptcha();
  }, []);

  // Handle case status search
  const formData = new FormData();
  const handleCaseStatusSearch = async (e) => {
    e.preventDefault();

    if (!caseId || !captcha) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    formData.append("cino", caseId);
    formData.append("captcha", captcha);
    try {
      const response = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve case information");
      } else {
        const data = await response.json();
        setStatusResult(data);
      }
    } catch (err) {
      setError(
        "Unable to retrieve case information. Please verify your case ID and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = () => {
    router.push(`/en/maps`);
  };

  // Reset status search
  const resetCaseSearch = () => {
    setCaseId("");
    setCaptcha("");
    setStatusResult(null);
    setError(null);
  };

  console.log("Status Result", statusResult);

  return (
    <div className="h-screen overflow-y-scroll py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Legal Clinics Card */}
          <Card
            className="overflow-hidden shadow-lg border-blue-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openModal("legalClinics")}
          >
            <CardHeader className=" border-b border-blue-300">
              <div className="flex items-center gap-3">
                <div className="bg-burgundy-1 00/50 p-2 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Legal Clinics</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                Free assistance on common legal issues
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  Upcoming Clinics
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-cream-800" />
                    <div>
                      <span className="font-medium">Housing Rights Clinic</span>
                      <p className="text-sm text-muted-foreground">
                        Every Tuesday, 4-7 PM
                      </p>
                    </div>
                  </li>
                  {/* More clinics shown in modal */}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                className="w-full hover:bg-cream-500 hover:text-primary-foreground py-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("legalClinics");
                }}
              >
                View all Legal Clinics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Bono Card */}
          <Card
            className="overflow-hidden shadow-lg border-blue-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openModal("proBono")}
          >
            <CardHeader className="border-b border-blue-300">
              <div className="flex items-center gap-3">
                <div className="bg-burgundy-1 00/50 p-2 rounded-full">
                  <Gavel className="h-6 w-6" />
                </div>
                <CardTitle>Pro Bono Representation</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                Full representation at no cost for qualifying clients
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  Eligibility Criteria
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-cream-800" />
                    Income below 200% of federal poverty guidelines
                  </li>
                  {/* More criteria shown in modal */}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                className="w-full hover:bg-cream-500 hover:text-primary-foreground py-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("proBono");
                }}
              >
                Learn About Eligibility
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Legal Consultations Card */}
          <Card
            className="overflow-hidden shadow-lg border-blue-200 hover:shadow-xl transition-shadow cursor-pointer backdrop-blur-sm"
            onClick={() => openModal("legalConsultations")}
          >
            <CardHeader className="border-b border-blue-300">
              <div className="flex items-center gap-3">
                <div className="bg-burgundy-1 00/50 p-2 rounded-full">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <CardTitle>Legal Consultations</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                One-on-one sessions with experienced attorneys
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  Consultation Options
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                    <div>
                      <span className="font-medium">
                        30-minute initial consultation
                      </span>
                      <p className="text-sm text-muted-foreground">$50</p>
                    </div>
                  </li>
                  {/* More options shown in modal */}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                className="w-full hover:bg-cream-500 hover:text-primary-foreground py-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("legalConsultations");
                }}
              >
                Schedule a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Case Status Card */}
          <Card
            className="overflow-hidden shadow-lg border-blue-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => openModal("caseStatus")}
          >
            <CardHeader className="border-b border-blue-300">
              <div className="flex items-center gap-3">
                <div className="bg-burgundy-1 00/50 p-2 rounded-full">
                  <Search className="h-6 w-6" />
                </div>
                <CardTitle>Case Status Lookup</CardTitle>
              </div>
              <CardDescription className="text-blue-200">
                Check the current status of your legal case
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="caseId-preview"
                    className="text-primary font-medium"
                  >
                    Case ID Number
                  </Label>
                  <Input
                    id="caseId-preview"
                    placeholder="Enter your case ID (e.g., ABC-12345)"
                    className="border-blue-200 focus:border-cream-400 focus:ring-cream-400"
                    disabled
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                className="w-full hover:bg-cream-500 hover:text-primary-foreground py-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal("caseStatus");
                }}
              >
                Check Case Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Legal Clinics Modal */}
      <Modal
        isOpen={activeModal === "legalClinics"}
        onClose={closeModal}
        title="Legal Clinics"
      >
        <div className="space-y-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Upcoming Clinics
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-cream-800" />
                <div>
                  <span className="font-medium">Housing Rights Clinic</span>
                  <p className="text-sm text-muted-foreground">
                    Every Tuesday, 4-7 PM
                  </p>
                  <p className="text-sm mt-1">
                    Get assistance with tenant rights, evictions, housing
                    discrimination, and more.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-cream-800" />
                <div>
                  <span className="font-medium">Family Law Clinic</span>
                  <p className="text-sm text-muted-foreground">
                    First Saturday Monthly, 10 AM-1 PM
                  </p>
                  <p className="text-sm mt-1">
                    Support for divorce, child custody, domestic violence
                    protection, and family-related matters.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-cream-800" />
                <div>
                  <span className="font-medium">Immigration Clinic</span>
                  <p className="text-sm text-muted-foreground">
                    Third Thursday Monthly, 5-8 PM
                  </p>
                  <p className="text-sm mt-1">
                    Guidance on DACA, visa applications, naturalization, asylum,
                    and general immigration processes.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CalendarDays className="mr-2 h-5 w-5 mt-0.5 text-cream-800" />
                <div>
                  <span className="font-medium">Employment Law Clinic</span>
                  <p className="text-sm text-muted-foreground">
                    Second Friday Monthly, 3-6 PM
                  </p>
                  <p className="text-sm mt-1">
                    Assistance with wage theft, workplace discrimination, unsafe
                    working conditions, and more.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Services Offered
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Brief legal advice and consultation
                  </span>
                  <p className="text-sm mt-1">
                    Get answers to your legal questions from qualified
                    attorneys.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Document review and assistance
                  </span>
                  <p className="text-sm mt-1">
                    Help understanding and completing legal paperwork.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Referrals to specialized legal services
                  </span>
                  <p className="text-sm mt-1">
                    Connections to specialized attorneys when your case requires
                    it.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Know-your-rights information
                  </span>
                  <p className="text-sm mt-1">
                    Educational materials about your legal rights and
                    responsibilities.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              What to Bring
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-cream-800" />
                Government-issued ID
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-cream-800" />
                Any relevant legal documents or paperwork
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-cream-800" />
                List of questions you want to ask
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-cream-800" />
                Any court notices or deadlines
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Button
              className="bg-beige-400 hover:bg-beige-600"
              onClick={handleClick}
            >
              See nearby Legal Clinics
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-primary hover:bg-cream-500 text-primary-foreground"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pro Bono Modal */}
      <Modal
        isOpen={activeModal === "proBono"}
        onClose={closeModal}
        title="Pro Bono Representation"
      >
        <div className="space-y-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Eligibility Criteria
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Income below 200% of federal poverty guidelines
                  </span>
                  <p className="text-sm mt-1">
                    For example, $36,620 for a family of two, $55,500 for a
                    family of four (2025 guidelines).
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Residency in our service area
                  </span>
                  <p className="text-sm mt-1">
                    Currently serving the following counties: Jefferson,
                    Madison, Walker, and Shelby.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Case falls within our priority areas
                  </span>
                  <p className="text-sm mt-1">
                    See Practice Areas section below for details on what types
                    of cases we accept.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Limited or no access to legal resources
                  </span>
                  <p className="text-sm mt-1">
                    Our services focus on those who cannot afford private
                    attorneys or have complex cases.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Practice Areas
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary">
                    Domestic Violence & Family Safety
                  </h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Restraining orders
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Safety planning
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Emergency custody
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-primary">
                    Housing & Eviction Defense
                  </h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Eviction prevention
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Habitability issues
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Housing discrimination
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary">
                    Public Benefits & Healthcare Access
                  </h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      SNAP/food stamps
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Medicaid/Medicare
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Disability benefits
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-primary">
                    Immigration & Asylum
                  </h4>
                  <ul className="mt-2 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      Asylum applications
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      U-Visa for victims
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-cream-800" />
                      VAWA petitions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Application Process
            </h3>
            <ol className="list-decimal ml-5 space-y-3">
              <li>
                <span className="font-medium">Initial Screening Call</span>
                <p className="text-sm mt-1">
                  Call our intake line at (555) 123-4567 between 9 AM and 4 PM,
                  Monday through Friday.
                </p>
              </li>
              <li>
                <span className="font-medium">Eligibility Assessment</span>
                <p className="text-sm mt-1">
                  Our intake team will ask questions about your financial
                  situation and legal issue.
                </p>
              </li>
              <li>
                <span className="font-medium">Document Submission</span>
                <p className="text-sm mt-1">
                  If eligible, you'll be asked to provide documentation of
                  income, residency, and case details.
                </p>
              </li>
              <li>
                <span className="font-medium">Case Review</span>
                <p className="text-sm mt-1">
                  Our legal team will review your case to determine if we can
                  provide representation.
                </p>
              </li>
              <li>
                <span className="font-medium">Attorney Assignment</span>
                <p className="text-sm mt-1">
                  If accepted, your case will be assigned to a pro bono attorney
                  with expertise in your legal issue.
                </p>
              </li>
            </ol>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-primary hover:bg-cream-500 text-primary-foreground"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Legal Consultations Modal */}
      <Modal
        isOpen={activeModal === "legalConsultations"}
        onClose={closeModal}
        title="Legal Consultations"
      >
        <div className="space-y-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Consultation Options
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    30-minute initial consultation
                  </span>
                  <p className="text-sm text-muted-foreground">$50</p>
                  <p className="text-sm mt-1">
                    Perfect for discussing your legal issue and determining next
                    steps. Get a quick assessment of your situation and basic
                    legal advice.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    60-minute comprehensive consultation
                  </span>
                  <p className="text-sm text-muted-foreground">$95</p>
                  <p className="text-sm mt-1">
                    In-depth analysis of your legal matter with detailed advice
                    and strategy. Includes document review and explanation of
                    legal options.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    90-minute complex case consultation
                  </span>
                  <p className="text-sm mt-1">
                    Designed for complex legal matters requiring extensive
                    analysis. Includes action plan development and preliminary
                    document preparation guidance.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 mt-1 text-cream-800" />
                <div>
                  <span className="font-medium">
                    Virtual consultations available
                  </span>
                  <p className="text-sm mt-1">
                    All consultation options can be conducted via secure video
                    conference for your convenience.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              Areas of Expertise
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-primary mb-2">Business Law</h4>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Entity formation
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Contract review
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Employment policies
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">
                  Employment Law
                </h4>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Workplace discrimination
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Wrongful termination
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Harassment cases
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">Family Law</h4>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Divorce proceedings
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Child custody
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Support obligations
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-primary mb-2">
                  Estate Planning
                </h4>
                <ul className="space-y-1">
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Wills and trusts
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-800" />
                    Power of attorney
                  </li>
                  <li className="flex items-center">
                    <Check className="h-3 w-3 mr-2 text-cream-400" />
                    Healthcare directives
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 text-primary">
              How to Schedule
            </h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>
                <span className="font-medium">Call our scheduling line:</span>{" "}
                (555) 234-5678
              </li>
              <li>
                <span className="font-medium">Complete our online form:</span>{" "}
                Fill out your information and preferred time slots
              </li>
              <li>
                <span className="font-medium">Payment:</span> Consultation fees
                must be paid prior to your appointment
              </li>
              <li>
                <span className="font-medium">Confirmation:</span> You'll
                receive a confirmation email with details and any documents to
                prepare
              </li>
            </ol>
            <div className="mt-4 flex justify-center">
              <Button className="bg-cream-500 hover:bg-cream-600 text-white">
                Schedule Online Now
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-primary hover:bg-cream-500 text-primary-foreground"
              onClick={closeModal}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Case Status Modal */}
      <Modal
        isOpen={activeModal === "caseStatus"}
        onClose={closeModal}
        title="Case Status Lookup"
      >
        <div className="space-y-6">
          {statusResult?.success ? (
            <CaseDetails
              result={statusResult.result}
              success={statusResult.success}
            />
          ) : (
            <form onSubmit={handleCaseStatusSearch} className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caseId" className="text-primary font-medium">
                    Case ID Number
                  </Label>
                  <Input
                    id="caseId"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    placeholder="Enter your case ID (e.g., ABC-12345)"
                    className="border-blue-200 focus:border-cream-400 focus:ring-cream-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captcha" className="text-primary font-medium">
                    CAPTCHA
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="captcha"
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      placeholder="Enter CAPTCHA"
                      className="border-blue-200 focus:border-cream-400 focus:ring-cream-400 flex-1"
                    />
                    {isCaptchaLoading ? (
                      <SmallLoader />
                    ) : (
                      <Image
                        src={`data:image/png;base64,${captchaImage}`}
                        alt="CAPTCHA"
                        width={120}
                        height={40}
                        className="rounded-md border border-blue-200"
                      />
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetCaseSearch}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-cream-500 text-primary-foreground"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <SmallLoader />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
