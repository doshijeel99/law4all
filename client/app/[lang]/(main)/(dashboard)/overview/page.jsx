"use client";

import React from "react";
import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Settings,
  MessageCircle,
  Users,
  Scale,
  Globe,
  FileText,
  ArrowUp,
  BarChart,
  Calendar,
  ArrowUpRight,
  Mail,
  Briefcase,
} from "lucide-react";

export default function Dashboard() {
  // Mock data for the dashboard
  const activeAdvocates = 2347;
  const casesSupported = 856;
  const communitiesReached = 182;
  const successRate = "78.5%";

  const recentCases = [
    {
      id: 1,
      title: "Environmental Protection Act Violation",
      location: "Sierra County, CA",
      status: "Active",
      img: "/api/placeholder/40/40",
    },
    {
      id: 2,
      title: "Indigenous Land Rights Claim",
      location: "British Columbia, CA",
      status: "Active",
      img: "/api/placeholder/40/40",
    },
    {
      id: 3,
      title: "Clean Water Access Lawsuit",
      location: "Michigan, US",
      status: "Review",
      img: "/api/placeholder/40/40",
    },
    {
      id: 4,
      title: "Public Housing Discrimination",
      location: "New York, US",
      status: "Won",
      img: "/api/placeholder/40/40",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "International Human Rights Summit",
      date: "Mar 15, 2025",
      location: "Geneva",
    },
    {
      id: 2,
      title: "Legal Aid Workshop",
      date: "Mar 22, 2025",
      location: "Virtual",
    },
    {
      id: 3,
      title: "Community Justice Panel",
      date: "Apr 05, 2025",
      location: "Toronto",
    },
  ];

  return (
    <div className="h-screen overflow-y-scroll bg-gray-100 dark:bg-gray-900">
      {/* Modified Hero Section with Map and Content Side by Side */}
      <div className="py-8 dark:bg-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content Side */}
            <div>
              <p className="font-bold text-xl md:text-4xl dark:text-white text-black mb-4">
                Global{" "}
                <span className="text-neutral-400">
                  {"Justice".split("").map((word, idx) => (
                    <motion.span
                      key={idx}
                      className="inline-block"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.04 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </p>
              <p className="text-sm md:text-lg text-neutral-500 mb-6">
                Connecting legal advocates worldwide to support communities in
                need. Fighting for equality, access to justice, and human rights
                across borders.
              </p>

              {/* Quick Stats in the Hero Section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Legal Advocates
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeAdvocates}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {successRate}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Get Involved
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  Learn More
                </button>
              </div>
            </div>

            {/* Map Side - Takes half the width */}
            <div className="h-64 md:h-96">
              <WorldMap
                dots={[
                  {
                    start: { lat: 40.7128, lng: -74.006 }, // New York
                    end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                  },
                  {
                    start: { lat: 40.7128, lng: -74.006 }, // New York
                    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                  },
                  {
                    start: { lat: 51.5074, lng: -0.1278 }, // London
                    end: { lat: 48.8566, lng: 2.3522 }, // Paris
                  },
                  {
                    start: { lat: 51.5074, lng: -0.1278 }, // London
                    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  },
                  {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: -33.8688, lng: 151.2093 }, // Sydney
                  },
                  {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Box Dashboard Layout */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Legal Justice Network
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Working together to provide legal support to underserved communities
            worldwide.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Key Metrics Row - Each card precisely sized */}
          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Legal Advocates
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {activeAdvocates}
                  </p>
                  <p className="text-sm text-green-500 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> 12% this month
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cases Supported
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {casesSupported}
                  </p>
                  <p className="text-sm text-green-500 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> 8% this month
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Communities Reached
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {communitiesReached}
                  </p>
                  <p className="text-sm text-green-500 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> 5% this month
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 sm:col-span-6 lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Success Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {successRate}
                  </p>
                  <p className="text-sm text-green-500 flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" /> 2.3% this month
                  </p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                  <BarChart className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Cases - Larger section spanning columns */}
          <Card className="col-span-12 lg:col-span-8 row-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Active Legal Cases</CardTitle>
              <CardDescription>
                Recent legal cases our network is supporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {recentCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage
                            src={caseItem.img}
                            alt={caseItem.title}
                          />
                          <AvatarFallback>
                            {caseItem.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {caseItem.title}
                          </p>
                          <Badge
                            className={
                              caseItem.status === "Won"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : caseItem.status === "Active"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }
                          >
                            {caseItem.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {caseItem.location}
                        </p>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-400" />
                              <span>8 advocates</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
                              View details
                              <ArrowUpRight className="ml-1 h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  View All Cases
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Events + Get Involved - Arranged vertically */}
          <div className="col-span-12 lg:col-span-4 grid gap-4">
            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Legal advocacy events and workshops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex">
                      <div className="flex-shrink-0 flex flex-col items-center mr-4">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div className="h-full w-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {event.date} • {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    View all events
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Get Involved */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Get Involved</CardTitle>
                <CardDescription>
                  Join our global advocacy network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg">
                    <Users className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-sm">Volunteer</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-500 mb-2" />
                    <span className="text-sm">Consult</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg">
                    <FileText className="h-6 w-6 text-purple-500 mb-2" />
                    <span className="text-sm">Submit Case</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg">
                    <Scale className="h-6 w-6 text-yellow-500 mb-2" />
                    <span className="text-sm">Donate</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom row - Equal width cards */}
          <Card className="col-span-12 md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Our Impact</CardTitle>
              <CardDescription>Making a difference worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  1.2M+
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  People helped worldwide
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    76
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Countries
                  </p>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    321
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Partners
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Legal Resources</CardTitle>
              <CardDescription>Access to justice materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Human Rights Guidelines
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Updated Feb 2025
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Environmental Law Toolkit
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Updated Jan 2025
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Indigenous Rights Manual
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Updated Dec 2024
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View Resource Library
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    support@legaljustice.network
                  </p>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Pro Bono: probono@legaljustice.network
                  </p>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    International: global@legaljustice.network
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Send Message
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
