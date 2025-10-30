import { useState, useEffect, useMemo } from "react";
import {
  useDeliveryCharges,
  useDefaultDeliveryCharges,
} from "./use-delivery-charges";
import {
  DeliveryCharge,
  DefaultDeliveryCharge,
} from "@/types/owner-site/admin/delivery-charges";

interface UseDeliveryChargeCalculatorProps {
  selectedCityDistrict: string;
  totalWeight: number;
}

export const useDeliveryChargeCalculator = ({
  selectedCityDistrict,
  totalWeight,
}: UseDeliveryChargeCalculatorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: deliveryChargesData, isLoading: isLoadingCharges } =
    useDeliveryCharges(1, 500, debouncedSearch);
  const { data: defaultChargesData, isLoading: isLoadingDefaults } =
    useDefaultDeliveryCharges();

  const isLoading = isLoadingCharges || isLoadingDefaults;

  // Helper to check if a value is valid (not null, not 0, and not "0.00")
  const isValidPrice = (price: string | null | undefined): boolean => {
    if (price === null || price === undefined) return false;
    const numValue = parseFloat(price);
    return !isNaN(numValue) && numValue > 0;
  };

  // Get weight range price based on weight
  const getWeightRangePrice = (
    charge: DeliveryCharge | DefaultDeliveryCharge,
    weight: number
  ): string | null => {
    if (weight <= 1) return charge.cost_0_1kg;
    if (weight <= 2) return charge.cost_1_2kg;
    if (weight <= 3) return charge.cost_2_3kg;
    if (weight <= 5) return charge.cost_3_5kg;
    if (weight <= 10) return charge.cost_5_10kg;
    return charge.cost_above_10kg;
  };

  const calculateDeliveryCharge = (): number => {
    // If no delivery charges data available, return 0
    if (
      (!deliveryChargesData?.results ||
        deliveryChargesData.results.length === 0) &&
      (!defaultChargesData?.default_price ||
        defaultChargesData.default_price.length === 0)
    ) {
      return 0;
    }

    let locationCharge: DeliveryCharge | undefined;
    const defaultCharge = defaultChargesData?.default_price?.[0];

    // Find location-specific charge
    if (selectedCityDistrict && deliveryChargesData?.results) {
      locationCharge = deliveryChargesData.results.find(
        (charge: DeliveryCharge) =>
          charge.location_name?.toLowerCase() ===
          selectedCityDistrict.toLowerCase()
      );
    }

    // STEP 1: Try location-specific weight range price
    if (locationCharge) {
      const weightRangePrice = getWeightRangePrice(locationCharge, totalWeight);
      if (isValidPrice(weightRangePrice)) {
        return parseFloat(weightRangePrice!);
      }

      // STEP 2: Try location's default_cost
      if (isValidPrice(locationCharge.default_cost)) {
        return parseFloat(locationCharge.default_cost!);
      }
    }

    // STEP 3: Try default charge's weight range price
    if (defaultCharge) {
      const defaultWeightRangePrice = getWeightRangePrice(
        defaultCharge,
        totalWeight
      );
      if (isValidPrice(defaultWeightRangePrice)) {
        return parseFloat(defaultWeightRangePrice!);
      }

      // STEP 4: Try default charge's default_cost
      if (isValidPrice(defaultCharge.default_cost)) {
        return parseFloat(defaultCharge.default_cost!);
      }
    }

    // Final fallback: check for any default in delivery charges
    if (deliveryChargesData?.results) {
      const fallbackCharge = deliveryChargesData.results.find(
        (charge: DeliveryCharge) => charge.is_default
      );
      if (fallbackCharge) {
        const fallbackWeightPrice = getWeightRangePrice(
          fallbackCharge,
          totalWeight
        );
        if (isValidPrice(fallbackWeightPrice)) {
          return parseFloat(fallbackWeightPrice!);
        }
        if (isValidPrice(fallbackCharge.default_cost)) {
          return parseFloat(fallbackCharge.default_cost!);
        }
      }
    }

    return 0;
  };

  const deliveryCharge = calculateDeliveryCharge();

  // Get unique cities/districts for dropdown with search filtering
  const allCitiesDistricts = useMemo(() => {
    const cities = [
      "None", // Add "None" option at the beginning
      ...(deliveryChargesData?.results
        ?.filter(
          (charge: DeliveryCharge) => charge.location_name && !charge.is_default
        )
        .map((charge: DeliveryCharge) => charge.location_name as string)
        .filter(
          (name: string, index: number, array: string[]) =>
            array.indexOf(name) === index
        )
        .sort() || []),
    ];

    // If there's a search query, filter the cities
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return cities.filter(city => city.toLowerCase().includes(query));
    }

    return cities;
  }, [deliveryChargesData, searchQuery]);

  return {
    deliveryCharge,
    citiesDistricts: allCitiesDistricts,
    isLoading,
    deliveryChargesData,
    defaultChargesData,
    searchQuery,
    setSearchQuery,
  };
};
