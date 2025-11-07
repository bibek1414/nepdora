"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useDefaultDeliveryCharges,
  useUpdateDefaultDeliveryCharges,
  useDeliveryCharges,
  useLoadDefaultValues,
  useUpdateDeliveryCharge,
  useCreateDeliveryCharge,
} from "@/hooks/owner-site/admin/use-delivery-charges";
import { DeliveryCharge } from "@/types/owner-site/admin/delivery-charges";
import { Search, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useDebouncer } from "@/hooks/use-debouncer";
import Pagination from "@/components/ui/pagination";

interface NewLocationCharge {
  location_name: string;
  default_cost: string;
  cost_0_1kg: string;
  cost_1_2kg: string;
  cost_2_3kg: string;
  cost_3_5kg: string;
  cost_5_10kg: string;
  cost_above_10kg: string;
}

export default function DeliveryChargesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebouncer(searchQuery, 500);

  const [defaultCharges, setDefaultCharges] = useState({
    id: 0,
    default_cost: "",
    cost_0_1kg: "",
    cost_1_2kg: "",
    cost_2_3kg: "",
    cost_3_5kg: "",
    cost_5_10kg: "",
    cost_above_10kg: "",
  });
  const [locationCharges, setLocationCharges] = useState<
    Record<number, Partial<DeliveryCharge>>
  >({});
  const [modifiedLocations, setModifiedLocations] = useState<Set<number>>(
    new Set()
  );
  const [isDefaultModified, setIsDefaultModified] = useState(false);
  const [newLocations, setNewLocations] = useState<NewLocationCharge[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch default charges
  const { data: defaultData, isLoading: isLoadingDefault } =
    useDefaultDeliveryCharges();

  // Fetch location charges with pagination and search
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    error,
  } = useDeliveryCharges(currentPage, 50, debouncedSearch);

  const loadDefaultMutation = useLoadDefaultValues();
  const updateDefaultMutation = useUpdateDefaultDeliveryCharges();
  const updateMutation = useUpdateDeliveryCharge();
  const createMutation = useCreateDeliveryCharge();

  // Helper function to convert value to display format (blank for null/0/0.00)
  const toDisplayValue = (value: string | null | undefined) => {
    if (
      !value ||
      value === "0" ||
      value === "0.00" ||
      parseFloat(value) === 0
    ) {
      return "";
    }
    return value;
  };

  // Helper function to convert display value to save format (empty string for blank)
  const toSaveValue = (value: string): string => {
    if (!value || value.trim() === "") {
      return "";
    }
    return value;
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Initialize default charges from API
  useEffect(() => {
    if (defaultData?.default_price?.[0]) {
      const defaultPrice = defaultData.default_price[0];
      setDefaultCharges({
        id: defaultPrice.id,
        default_cost: toDisplayValue(defaultPrice.default_cost),
        cost_0_1kg: toDisplayValue(defaultPrice.cost_0_1kg),
        cost_1_2kg: toDisplayValue(defaultPrice.cost_1_2kg),
        cost_2_3kg: toDisplayValue(defaultPrice.cost_2_3kg),
        cost_3_5kg: toDisplayValue(defaultPrice.cost_3_5kg),
        cost_5_10kg: toDisplayValue(defaultPrice.cost_5_10kg),
        cost_above_10kg: toDisplayValue(defaultPrice.cost_above_10kg),
      });
      setIsDefaultModified(false);
    }
  }, [defaultData]);

  // Initialize location charges from API
  useEffect(() => {
    if (locationsData?.results) {
      const charges: Record<number, Partial<DeliveryCharge>> = {};
      locationsData.results.forEach(location => {
        charges[location.id] = {
          default_cost: toDisplayValue(location.default_cost),
          cost_0_1kg: toDisplayValue(location.cost_0_1kg),
          cost_1_2kg: toDisplayValue(location.cost_1_2kg),
          cost_2_3kg: toDisplayValue(location.cost_2_3kg),
          cost_3_5kg: toDisplayValue(location.cost_3_5kg),
          cost_5_10kg: toDisplayValue(location.cost_5_10kg),
          cost_above_10kg: toDisplayValue(location.cost_above_10kg),
        };
      });
      setLocationCharges(prev => ({ ...prev, ...charges }));
    }
  }, [locationsData]);

  // Load default values if no data
  useEffect(() => {
    if (!isLoadingLocations && locationsData?.count === 0) {
      loadDefaultMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success("Default delivery charges loaded successfully");
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(
            error?.message || "Failed to load default delivery charges"
          );
        },
      });
    }
  }, [isLoadingLocations, locationsData]);

  const handleSaveChanges = async () => {
    try {
      const updatePromises = [];
      let hasNewLocations = false;

      // Save default charges only if modified
      if (isDefaultModified && defaultCharges.id) {
        updatePromises.push(
          updateDefaultMutation.mutateAsync({
            id: defaultCharges.id,
            data: {
              default_cost: toSaveValue(defaultCharges.default_cost),
              cost_0_1kg: toSaveValue(defaultCharges.cost_0_1kg),
              cost_1_2kg: toSaveValue(defaultCharges.cost_1_2kg),
              cost_2_3kg: toSaveValue(defaultCharges.cost_2_3kg),
              cost_3_5kg: toSaveValue(defaultCharges.cost_3_5kg),
              cost_5_10kg: toSaveValue(defaultCharges.cost_5_10kg),
              cost_above_10kg: toSaveValue(defaultCharges.cost_above_10kg),
            },
          })
        );
      }

      // Save only modified location charges
      modifiedLocations.forEach(locationId => {
        const charges = locationCharges[locationId];
        if (charges) {
          updatePromises.push(
            updateMutation.mutateAsync({
              id: locationId,
              default_cost: toSaveValue(charges.default_cost || ""),
              cost_0_1kg: toSaveValue(charges.cost_0_1kg || ""),
              cost_1_2kg: toSaveValue(charges.cost_1_2kg || ""),
              cost_2_3kg: toSaveValue(charges.cost_2_3kg || ""),
              cost_3_5kg: toSaveValue(charges.cost_3_5kg || ""),
              cost_5_10kg: toSaveValue(charges.cost_5_10kg || ""),
              cost_above_10kg: toSaveValue(charges.cost_above_10kg || ""),
            })
          );
        }
      });

      // Create new locations
      newLocations.forEach(newLocation => {
        if (newLocation.location_name.trim()) {
          hasNewLocations = true;
          updatePromises.push(
            createMutation.mutateAsync({
              location_name: newLocation.location_name.trim(),
              default_cost: toSaveValue(newLocation.default_cost),
              cost_0_1kg: toSaveValue(newLocation.cost_0_1kg),
              cost_1_2kg: toSaveValue(newLocation.cost_1_2kg),
              cost_2_3kg: toSaveValue(newLocation.cost_2_3kg),
              cost_3_5kg: toSaveValue(newLocation.cost_3_5kg),
              cost_5_10kg: toSaveValue(newLocation.cost_5_10kg),
              cost_above_10kg: toSaveValue(newLocation.cost_above_10kg),
            })
          );
        }
      });

      if (updatePromises.length === 0) {
        toast.info("No changes to save");
        return;
      }

      await Promise.all(updatePromises);

      // Use different success messages based on the type of changes
      if (
        hasNewLocations &&
        modifiedLocations.size === 0 &&
        !isDefaultModified
      ) {
        toast.success("Delivery charges added successfully");
      } else if (hasNewLocations) {
        toast.success("Delivery charges updated and added successfully");
      } else {
        toast.success("Delivery charges updated successfully");
      }

      // Reset modified states
      setIsDefaultModified(false);
      setModifiedLocations(new Set());
      setNewLocations([]);
      setShowAddForm(false);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Failed to update delivery charges");
    }
  };

  const handleCancelChanges = () => {
    // Reset default charges to original values
    if (defaultData?.default_price?.[0]) {
      const defaultPrice = defaultData.default_price[0];
      setDefaultCharges({
        id: defaultPrice.id,
        default_cost: toDisplayValue(defaultPrice.default_cost),
        cost_0_1kg: toDisplayValue(defaultPrice.cost_0_1kg),
        cost_1_2kg: toDisplayValue(defaultPrice.cost_1_2kg),
        cost_2_3kg: toDisplayValue(defaultPrice.cost_2_3kg),
        cost_3_5kg: toDisplayValue(defaultPrice.cost_3_5kg),
        cost_5_10kg: toDisplayValue(defaultPrice.cost_5_10kg),
        cost_above_10kg: toDisplayValue(defaultPrice.cost_above_10kg),
      });
    }

    // Reset location charges to original values
    if (locationsData?.results) {
      const charges: Record<number, Partial<DeliveryCharge>> = {};
      locationsData.results.forEach(location => {
        charges[location.id] = {
          default_cost: toDisplayValue(location.default_cost),
          cost_0_1kg: toDisplayValue(location.cost_0_1kg),
          cost_1_2kg: toDisplayValue(location.cost_1_2kg),
          cost_2_3kg: toDisplayValue(location.cost_2_3kg),
          cost_3_5kg: toDisplayValue(location.cost_3_5kg),
          cost_5_10kg: toDisplayValue(location.cost_5_10kg),
          cost_above_10kg: toDisplayValue(location.cost_above_10kg),
        };
      });
      setLocationCharges(charges);
    }

    // Clear all modified states
    setIsDefaultModified(false);
    setModifiedLocations(new Set());
    setNewLocations([]);
    setShowAddForm(false);

    toast.info("All changes have been cancelled");
  };

  const handleDefaultChargeChange = (field: string, value: string) => {
    setDefaultCharges(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsDefaultModified(true);
  };

  const handleLocationChargeChange = (
    locationId: number,
    field: string,
    value: string
  ) => {
    setLocationCharges(prev => ({
      ...prev,
      [locationId]: {
        ...prev[locationId],
        [field]: value,
      },
    }));
    setModifiedLocations(prev => new Set(prev).add(locationId));
  };

  const handleAddNewRow = () => {
    setNewLocations(prev => [
      ...prev,
      {
        location_name: "",
        default_cost: "",
        cost_0_1kg: "",
        cost_1_2kg: "",
        cost_2_3kg: "",
        cost_3_5kg: "",
        cost_5_10kg: "",
        cost_above_10kg: "",
      },
    ]);
    setShowAddForm(true);
  };

  const handleNewLocationChange = (
    index: number,
    field: keyof NewLocationCharge,
    value: string
  ) => {
    setNewLocations(prev =>
      prev.map((location, i) =>
        i === index ? { ...location, [field]: value } : location
      )
    );
  };

  const handleRemoveNewLocation = (index: number) => {
    setNewLocations(prev => prev.filter((_, i) => i !== index));
    if (newLocations.length === 1) {
      setShowAddForm(false);
    }
  };

  const hasChanges =
    isDefaultModified || modifiedLocations.size > 0 || newLocations.length > 0;
  const totalChanges =
    (isDefaultModified ? 1 : 0) + modifiedLocations.size + newLocations.length;
  const isLoading = isLoadingDefault || isLoadingLocations;

  // Pagination calculations
  const totalPages = locationsData ? Math.ceil(locationsData.count / 10) : 0;

  if (isLoading && !locationsData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading delivery charges. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Delivery Charges Management
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Configure delivery charges for different locations and cart weights
          </p>
        </div>

        {/* Desktop Save Button */}
        <div className="hidden lg:block">
          <Button
            onClick={handleSaveChanges}
            disabled={
              !hasChanges ||
              updateMutation.isPending ||
              updateDefaultMutation.isPending ||
              createMutation.isPending
            }
            className="bg-primary hover:bg-primary text-white"
          >
            {updateMutation.isPending ||
            updateDefaultMutation.isPending ||
            createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                SAVE CHANGES
                {hasChanges && (
                  <span className="bg-primary ml-2 rounded-full px-2 py-0.5 text-xs">
                    {totalChanges}
                  </span>
                )}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Default Cost Section */}
      <div className="bg-white">
        <div className="">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Default Cost For Various Cart Weight
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Note: All fields are (cost in Rs.)
              </p>
            </div>

            {/* Default Section Save Indicator */}
            {isDefaultModified && (
              <div className="flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-600">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-600"></span>
                Default costs modified
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost 0-1KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost 1-2KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost 2-3KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost 3-5KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost 5-10KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost &gt;10KG
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs">
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.default_cost}
                      onChange={e =>
                        handleDefaultChargeChange(
                          "default_cost",
                          e.target.value
                        )
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.cost_0_1kg}
                      onChange={e =>
                        handleDefaultChargeChange("cost_0_1kg", e.target.value)
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.cost_1_2kg}
                      onChange={e =>
                        handleDefaultChargeChange("cost_1_2kg", e.target.value)
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.cost_2_3kg}
                      onChange={e =>
                        handleDefaultChargeChange("cost_2_3kg", e.target.value)
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.cost_3_5kg}
                      onChange={e =>
                        handleDefaultChargeChange("cost_3_5kg", e.target.value)
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.cost_5_10kg}
                      onChange={e =>
                        handleDefaultChargeChange("cost_5_10kg", e.target.value)
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <Input
                      type="number"
                      value={defaultCharges.cost_above_10kg}
                      onChange={e =>
                        handleDefaultChargeChange(
                          "cost_above_10kg",
                          e.target.value
                        )
                      }
                      className="w-full md:text-xs"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Delivery Charge Section */}
      <div className="bg-white">
        <div className="">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="mb-1 text-xl font-semibold">
                Custom Delivery Charge Place & Cost
              </h2>
              <p className="text-xs text-gray-500">
                Note: All empty cost fields are replaced by default cost
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Custom Section Save Indicator */}
              {(modifiedLocations.size > 0 || newLocations.length > 0) && (
                <div className="flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-600">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-600"></span>
                  {modifiedLocations.size} modified, {newLocations.length} new
                </div>
              )}

              {/* Add More Rows Button */}
              <Button
                onClick={handleAddNewRow}
                className="bg-primary hover:bg-primary text-white"
                size="sm"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Location
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-600" />
            <Input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 placeholder:text-gray-300"
            />
          </div>

          {/* Location Charges Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-12 border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    #
                  </th>
                  <th className="min-w-[200px] border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Place Name
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Default Cost
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Cost 0-1KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Cost 1-2KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Cost 2-3KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Cost 3-5KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Cost 5-10KG
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Cost &gt;10KG
                  </th>
                  <th className="w-12 border border-gray-300 px-4 py-3 text-left text-xs font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* New Location Rows */}
                {newLocations.map((newLocation, index) => (
                  <tr
                    key={`new-${index}`}
                    className="bg-green-50 hover:bg-green-100"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-xs text-gray-600">
                      <div className="flex items-center justify-center">
                        <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">
                          New
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="text"
                        value={newLocation.location_name}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "location_name",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder="Enter location name"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.default_cost}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "default_cost",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.default_cost || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.cost_0_1kg}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "cost_0_1kg",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.cost_0_1kg || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.cost_1_2kg}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "cost_1_2kg",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.cost_1_2kg || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.cost_2_3kg}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "cost_2_3kg",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.cost_2_3kg || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.cost_3_5kg}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "cost_3_5kg",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.cost_3_5kg || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.cost_5_10kg}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "cost_5_10kg",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.cost_5_10kg || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Input
                        type="number"
                        value={newLocation.cost_above_10kg}
                        onChange={e =>
                          handleNewLocationChange(
                            index,
                            "cost_above_10kg",
                            e.target.value
                          )
                        }
                        className="w-full border-green-300 bg-white md:text-xs"
                        placeholder={defaultCharges.cost_above_10kg || "0"}
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <Button
                        onClick={() => handleRemoveNewLocation(index)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

                {/* Existing Location Rows */}
                {locationsData?.results.map((location, index) => {
                  const isModified = modifiedLocations.has(location.id);
                  const globalIndex = (currentPage - 1) * 10 + index + 1;
                  return (
                    <tr
                      key={location.id}
                      className={`hover:bg-gray-50 ${
                        isModified ? "bg-amber-50" : ""
                      }`}
                    >
                      <td className="border border-gray-300 px-4 py-2 text-xs text-gray-600">
                        {globalIndex}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-xs font-medium">
                        <div className="flex items-center">
                          {location.location_name}
                          {isModified && (
                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-600"></span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={
                            locationCharges[location.id]?.default_cost ?? ""
                          }
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "default_cost",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.default_cost || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={locationCharges[location.id]?.cost_0_1kg ?? ""}
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "cost_0_1kg",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.cost_0_1kg || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={locationCharges[location.id]?.cost_1_2kg ?? ""}
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "cost_1_2kg",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.cost_1_2kg || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={locationCharges[location.id]?.cost_2_3kg ?? ""}
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "cost_2_3kg",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.cost_2_3kg || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={locationCharges[location.id]?.cost_3_5kg ?? ""}
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "cost_3_5kg",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.cost_3_5kg || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={
                            locationCharges[location.id]?.cost_5_10kg ?? ""
                          }
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "cost_5_10kg",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.cost_5_10kg || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <Input
                          type="number"
                          value={
                            locationCharges[location.id]?.cost_above_10kg ?? ""
                          }
                          onChange={e =>
                            handleLocationChargeChange(
                              location.id,
                              "cost_above_10kg",
                              e.target.value
                            )
                          }
                          className="w-full md:text-xs"
                          placeholder={defaultCharges.cost_above_10kg || "0"}
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {/* Empty action cell for existing rows to maintain table structure */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {locationsData?.results.length === 0 && newLocations.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No locations found matching your search.
            </div>
          )}

          {/* Pagination */}
          {locationsData && locationsData.count > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showFirstLast={true}
                maxVisiblePages={5}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky Save Changes Button */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
          <div className="flex min-w-[350px] items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg">
            <div className="flex items-center text-xs text-gray-700">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-600"></span>
              {totalChanges} change{totalChanges !== 1 ? "s" : ""} pending
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCancelChanges}
                variant="outline"
                size="sm"
                className="border-gray-300 whitespace-nowrap text-gray-700 hover:bg-gray-50"
                disabled={
                  updateMutation.isPending ||
                  updateDefaultMutation.isPending ||
                  createMutation.isPending
                }
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={
                  updateMutation.isPending ||
                  updateDefaultMutation.isPending ||
                  createMutation.isPending
                }
                className="bg-primary hover:bg-primary whitespace-nowrap text-white"
                size="sm"
              >
                {updateMutation.isPending ||
                updateDefaultMutation.isPending ||
                createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
