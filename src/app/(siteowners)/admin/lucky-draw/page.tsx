"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Gift, Trophy, Users, Calendar, Play, Plus } from "lucide-react";

const LuckyDraw = () => {
  const [isActive, setIsActive] = useState(true);

  const draws = [
    {
      id: 1,
      title: "Summer Special Draw",
      status: "Active",
      participants: 145,
      endDate: "2024-07-31",
      prize: "$500 Gift Card",
    },
    {
      id: 2,
      title: "New Customer Welcome",
      status: "Ended",
      participants: 89,
      endDate: "2024-06-30",
      prize: "Free Service Package",
    },
    {
      id: 3,
      title: "Monthly Loyalty Draw",
      status: "Draft",
      participants: 0,
      endDate: "2024-08-15",
      prize: "$200 Cash Prize",
    },
  ];

  return (
    <div className="mx-auto bg-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Lucky Draw</h1>
          <p className="text-gray-600">
            Create and manage lucky draw campaigns to engage customers.
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create New Draw
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Statistics Cards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">Total Draws</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-sm text-gray-500">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Winners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <Play className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-500">Active Draws</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Draw List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lucky Draw Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {draws.map((draw, index) => (
                  <div
                    key={draw.id}
                    className={`border-b border-gray-100 p-4 hover:bg-gray-50 ${
                      index === draws.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {draw.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={
                          draw.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : draw.status === "Ended"
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-100"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {draw.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>Prize: {draw.prize}</p>
                      <p>Participants: {draw.participants}</p>
                      <p>End Date: {draw.endDate}</p>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {draw.status === "Active" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Draw Winner
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="bg-primary hover:bg-primary w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create New Draw
              </Button>
              <Button variant="outline" className="w-full">
                <Trophy className="mr-2 h-4 w-4" />
                View All Winners
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Export Participants
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Draw Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto Draw</p>
                  <p className="text-sm text-gray-500">
                    Automatically draw winners
                  </p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Notify winners via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Max Entries Per User
                </label>
                <Input type="number" defaultValue="1" min="1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Sarah Johnson</span>
                  <span className="text-gray-500">$500 Gift Card</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Mike Chen</span>
                  <span className="text-gray-500">Free Service</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Emma Davis</span>
                  <span className="text-gray-500">$200 Cash</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
