import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 1,
      name: "Web Design",
      status: "Active",
      price: "$500",
      lastUpdated: "2023-09-15",
    },
    {
      id: 2,
      name: "SEO Optimization",
      status: "Inactive",
      price: "$300",
      lastUpdated: "2023-08-22",
    },
    {
      id: 3,
      name: "Content Creation",
      status: "Active",
      price: "$200",
      lastUpdated: "2023-07-10",
    },
    {
      id: 4,
      name: "Social Media Management",
      status: "Active",
      price: "$400",
      lastUpdated: "2023-06-05",
    },
    {
      id: 5,
      name: "Email Marketing",
      status: "Inactive",
      price: "$150",
      lastUpdated: "2023-05-18",
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <Button className="bg-gray-200 text-gray-900 hover:bg-gray-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute top-4 left-3 z-10 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services..."
            className="border-gray-200 bg-white pl-10 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Services Table */}
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-white">
                  <th className="p-4 text-left font-medium text-gray-600">
                    Name
                  </th>
                  <th className="p-4 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="p-4 text-left font-medium text-gray-600">
                    Price
                  </th>
                  <th className="p-4 text-left font-medium text-gray-600">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={service.id}
                    className={`border-b border-gray-100 hover:bg-white ${
                      index % 2 === 0 ? "bg-white" : "bg-white/30"
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-medium text-gray-900">
                        {service.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={
                          service.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }
                      >
                        {service.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-blue-600">
                        {service.price}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white0">{service.lastUpdated}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
