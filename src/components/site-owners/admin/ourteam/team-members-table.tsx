import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { useDeleteTeamMember } from "@/hooks/owner-site/admin/use-team-member";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamMembersTableProps {
  members: TEAM[];
  onEdit: (member: TEAM) => void;
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onEdit,
}) => {
  const deleteMutation = useDeleteTeamMember();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [memberToDelete, setMemberToDelete] = React.useState<number | null>(
    null
  );

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent row click
    setMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, member: TEAM) => {
    e.stopPropagation(); // Prevent row click
    onEdit(member);
  };

  const handleRowClick = (member: TEAM) => {
    onEdit(member);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMutation.mutateAsync(memberToDelete);
      toast.success("Team member deleted successfully");
    } catch (error) {
      console.error("Failed to delete team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const sortedMembers = [...members].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Order</TableHead>
            <TableHead className="w-20">Photo</TableHead>
            <TableHead className="min-w-32">Name</TableHead>
            <TableHead className="min-w-32">Role</TableHead>
            <TableHead className="min-w-40">About</TableHead>
            <TableHead className="w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-8 text-center"
              >
                No team members found. Click &quot;Add Team Member&quot; to get
                started.
              </TableCell>
            </TableRow>
          ) : (
            sortedMembers.map(member => {
              return (
                <TableRow
                  key={member.id}
                  className="hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(member)}
                >
                  <TableCell className="font-medium">
                    <Badge variant="outline">{member.order}</Badge>
                  </TableCell>
                  <TableCell>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.photo || ""} alt={member.name} />
                      <AvatarFallback className="text-sm font-medium">
                        {member.name
                          .split(" ")
                          .map(n => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{member.name}</div>
                    {member.department && (
                      <div className="text-muted-foreground text-sm">
                        {member.department.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {member.about ? (
                      <p className="truncate text-sm">{member.about}</p>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No description
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => handleEditClick(e, member)}
                        className="h-8 w-8 p-0"
                        title="Edit member"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => handleDeleteClick(e, member.id)}
                        disabled={deleteMutation.isPending}
                        className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                        title="Delete member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team member? This action
              cannot be undone and will permanently remove all their
              information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
