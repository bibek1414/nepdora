import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Phone, MapPin, Calendar } from "lucide-react";

const AdminProfile = () => {
  return (
    <div className="mx-auto bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and personal information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/api/placeholder/150/150" />
                  <AvatarFallback className="bg-blue-100 text-2xl text-blue-600">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute right-0 bottom-0 h-8 w-8 rounded-full bg-gray-800 p-0 hover:bg-gray-900"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">John Doe</h3>
              <p className="text-gray-500">Administrator</p>
              <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100">
                Active
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">john.doe@company.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">New York, USA</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Joined March 2023</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Input defaultValue="John" label="First Name" />
                </div>
                <div>
                  <Input defaultValue="Doe" label="Last Name" />
                </div>
              </div>
              <div>
                <Input
                  defaultValue="john.doe@company.com"
                  type="email"
                  label="Email"
                />
              </div>
              <div>
                <Input defaultValue="+1 (555) 123-4567" label="Phone" />
              </div>
              <div>
                <Input defaultValue="New York, USA" label="Address" />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-primary hover:bg-primary">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
