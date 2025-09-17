"use client";
import React from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Image } from "lucide-react";
import {
  useBanners,
  useDeleteBanner,
} from "@/hooks/owner-site/admin/use-banner";
import { Banner } from "@/types/owner-site/admin/banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BannerListProps {
  onAddBanner: () => void;
  onEditBanner: (banner: Banner) => void;
}

export default function BannerList({
  onAddBanner,
  onEditBanner,
}: BannerListProps) {
  const { data: banners, isLoading } = useBanners();
  const deleteBannerMutation = useDeleteBanner();

  const handleDeleteBanner = async (id: number) => {
    try {
      await deleteBannerMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const handleRowClick = (banner: Banner, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on action buttons
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }
    onEditBanner(banner);
  };

  return (
    <div className="container mx-auto p-3 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Banner Management
          </h1>
          <Button
            onClick={onAddBanner}
            className="self-start bg-gray-600 text-white hover:bg-gray-700 sm:self-auto"
          >
            <Plus size={20} className="mr-2" />
            Add Banner
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-12">
            <div className="text-center text-gray-500">Loading banners...</div>
          </CardContent>
        </Card>
      ) : banners && banners.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden lg:block">
            <Card className="border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Type
                    </TableHead>

                    <TableHead className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Images
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Created
                    </TableHead>
                    <TableHead className="text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map(banner => (
                    <TableRow
                      key={banner.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={e => handleRowClick(banner, e)}
                    >
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-800"
                        >
                          {banner.banner_type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center">
                          <Image className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {banner.images?.length || 0} images
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {banner.is_active ? (
                            <>
                              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-900">
                                Active
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="rounded-full bg-gray-300 px-2 py-1 text-sm text-gray-900">
                                Inactive
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">
                        {new Date(banner.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditBanner(banner)}
                            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          >
                            <Edit size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
                                disabled={deleteBannerMutation.isPending}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Banner
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this banner
                                  and all its images? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBanner(banner.id)}
                                  className="bg-red-600 text-white hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="space-y-4 lg:hidden">
            {banners.map(banner => (
              <Card
                key={banner.id}
                className="cursor-pointer border-gray-200 shadow-sm transition-colors hover:bg-gray-50"
                onClick={e => handleRowClick(banner, e)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800"
                      >
                        {banner.banner_type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditBanner(banner)}
                          className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                        >
                          <Edit size={16} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-red-600 hover:bg-red-50 hover:text-red-800"
                              disabled={deleteBannerMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this banner and
                                all its images? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {banner.is_active ? (
                          <>
                            <Eye className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-900">
                              Active
                            </span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-2 h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Inactive
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Image className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {banner.images?.length || 0} images
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(banner.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <div className="mb-4">
                <Image className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              </div>
              <p className="mb-4">No banners found.</p>
              <Button
                onClick={onAddBanner}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
              >
                Click &apos;Add Banner&apos; to create your first banner
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
