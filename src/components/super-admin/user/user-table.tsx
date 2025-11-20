import { User } from "@/types/super-admin/user";
import { Trash2, Mail, Store } from "lucide-react";
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
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Stores</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Loading users...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Stores</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map(user => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "owner" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {user.stores.map(store => (
                      <div
                        key={store.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Store size={14} className="text-gray-400" />
                        <span className="text-gray-700">
                          {store.store_name}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {store.role}
                        </Badge>
                      </div>
                    ))}
                    {user.stores.length === 0 && (
                      <span className="text-sm text-gray-500">No stores</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(user.id);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                No users available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
