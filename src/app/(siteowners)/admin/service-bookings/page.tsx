"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ServiceBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingBookings = [
    {
      id: 1,
      name: "Sarah",
      service: "Consultation with Sarah",
      date: "Tue, Jul 23",
      time: "10:00 AM - 11:00 AM",
      avatar: "/api/placeholder/40/40",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Alex",
      service: "Project Kickoff with Alex",
      date: "Wed, Jul 24",
      time: "2:00 PM - 3:00 PM",
      avatar: "/api/placeholder/40/40",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Emily",
      service: "Design Review with Emily",
      date: "Thu, Jul 25",
      time: "11:00 AM - 12:00 PM",
      avatar: "/api/placeholder/40/40",
      status: "Confirmed",
    },
  ];

  const selectedBooking = upcomingBookings[0];

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Service Bookings
        </h1>
        <p className="text-gray-600">
          Manage your scheduled appointments and service bookings.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b border-gray-200">
          {["upcoming", "calendar", "past"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Bookings List */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Upcoming Bookings
          </h2>
          <div className="space-y-4">
            {upcomingBookings.map(booking => (
              <Card key={booking.id} className="cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={booking.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {booking.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {booking.service}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {booking.date} · {booking.time}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 hover:bg-green-100"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Service
                  </label>
                  <p className="text-gray-900">Website Design</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date & Time
                  </label>
                  <p className="text-gray-900">
                    {selectedBooking.date}, {selectedBooking.time}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Client
                  </label>
                  <p className="text-gray-900">{selectedBooking.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Status
                  </label>
                  <Badge
                    variant="secondary"
                    className="w-fit bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1">
                  Reschedule
                </Button>
                <Button variant="destructive" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookings;
