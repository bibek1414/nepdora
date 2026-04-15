import { User } from "@/types/super-admin/user";
import { Trash2, Mail, MapPin, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function UserTable({
  users,
  onDelete,
  isLoading = false,
}: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50">
            <TableHead className="text-left font-semibold text-gray-700">
              User
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-700">
              Role
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-700">
              Associated Stores
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-700">
              Domains
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-700">
              Phone
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-700">
              Date
            </TableHead>
            <TableHead className="text-left font-semibold text-gray-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[80px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length > 0 ? (
            users.map(user => (
              <TableRow
                key={user.id}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
              >
                <TableCell className="py-4 text-left">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="px-2 font-medium text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-left">
                  <Badge
                    variant={user.role === "owner" ? "default" : "secondary"}
                    className="font-medium capitalize"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-left">
                  {user.stores.length > 0 ? (
                    <div className="space-y-2">
                      {user.stores.map(store => (
                        <div
                          key={store.id}
                          className="flex flex-col gap-1 rounded-lg p-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {store.store_name}
                            </span>
                          </div>
                          {(store.store_address || store.store_number) && (
                            <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                              {store.store_address && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={12} className="text-gray-400" />
                                  <span>{store.store_address}</span>
                                </div>
                              )}
                              {store.store_number && (
                                <div className="flex items-center gap-1.5">
                                  <Phone size={12} className="text-gray-400" />
                                  <span>{store.store_number}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No stores assigned
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-left">
                  {user.stores.length > 0 ? (
                    <div className="space-y-2">
                      {user.stores.map(store => (
                        <div
                          key={store.id}
                          className="flex flex-col gap-1 rounded-lg p-2"
                        >
                          <a
                            href={`https://${user.schema_name}.nepdora.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {user.schema_name}.nepdora.com
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      No domains available
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-left">
                  {user.phone_number ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      <span>{user.phone_number}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">N/A</span>
                  )}
                </TableCell>
                <TableCell className="py-4 text-left">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell className="py-4 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(user.id);
                    }}
                    className="h-9 w-9 p-0 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Mail size={40} className="text-gray-300" />
                  <p className="font-medium text-gray-400">
                    No users available
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
