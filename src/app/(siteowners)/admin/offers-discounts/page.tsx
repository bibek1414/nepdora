"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const OffersDiscounts = () => {
  const [activeTab, setActiveTab] = useState("giftCards");

  return (
    <div className="mx-auto bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Offers & Discounts
        </h1>
        <p className="text-gray-600">
          Create and manage promotions, gift cards, and special offers for your
          customers.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 border-b border-gray-200">
          {[
            { key: "giftCards", label: "Gift Cards" },
            { key: "discountCodes", label: "Discount Codes" },
            { key: "specialOffers", label: "Special Offers" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gift Cards Tab Content */}
      {activeTab === "giftCards" && (
        <div>
          <h2 className="mb-8 text-xl font-semibold text-gray-900">
            Gift Cards
          </h2>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12">
            {/* Gift Card Illustration */}
            <div className="relative mb-8">
              <div className="relative flex h-52 w-80 items-center justify-center rounded-lg bg-gradient-to-br from-pink-200 to-orange-200 shadow-lg">
                <div className="flex h-40 w-64 flex-col items-center justify-center rounded-md bg-gradient-to-br from-pink-100 to-orange-100 shadow-inner">
                  <div className="mb-4 h-2 w-6 rounded-full bg-gray-300"></div>
                  <div
                    className="font-script mb-2 text-2xl text-gray-600"
                    style={{ fontFamily: "cursive" }}
                  >
                    Gift
                  </div>
                  <div className="text-xs tracking-wide text-gray-500">
                    NATIONAL CABLE Y
                  </div>
                  <div className="text-xs tracking-wide text-gray-500">
                    SAFETY WORK
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State Text */}
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No gift cards yet
            </h3>
            <p className="mb-8 max-w-md text-center text-gray-600">
              Create gift cards to offer your customers a flexible way to
              purchase items from your store.
            </p>

            {/* Create Button */}
            <Button className="bg-gray-800 px-6 py-2 text-white hover:bg-gray-900">
              Create Gift Card
            </Button>
          </div>
        </div>
      )}

      {/* Discount Codes Tab Content */}
      {activeTab === "discountCodes" && (
        <div>
          <h2 className="mb-8 text-xl font-semibold text-gray-900">
            Discount Codes
          </h2>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Gift className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No discount codes yet
            </h3>
            <p className="mb-8 max-w-md text-center text-gray-600">
              Create discount codes to offer percentage or fixed amount
              discounts to your customers.
            </p>
            <Button className="bg-gray-800 px-6 py-2 text-white hover:bg-gray-900">
              Create Discount Code
            </Button>
          </div>
        </div>
      )}

      {/* Special Offers Tab Content */}
      {activeTab === "specialOffers" && (
        <div>
          <h2 className="mb-8 text-xl font-semibold text-gray-900">
            Special Offers
          </h2>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Gift className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No special offers yet
            </h3>
            <p className="mb-8 max-w-md text-center text-gray-600">
              Create special offers and promotions to attract new customers and
              reward loyal ones.
            </p>
            <Button className="bg-gray-800 px-6 py-2 text-white hover:bg-gray-900">
              Create Special Offer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersDiscounts;
