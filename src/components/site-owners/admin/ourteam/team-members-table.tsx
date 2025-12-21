import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";
import { RefreshCw } from "lucide-react";

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
  const [memberToDelete, setMemberToDelete] = React.useState<TEAM | null>(null);

  const handleDeleteClick = (member: TEAM) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMutation.mutateAsync(memberToDelete.id);
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
    <div className="rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="w-16 px-6 py-3 text-xs font-normal text-black/60">
              Order
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Member Info
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Role
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              About
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center text-xs text-black/40"
              >
                No team members found.
              </TableCell>
            </TableRow>
          ) : (
            sortedMembers.map(member => (
              <TableRow
                key={member.id}
                className="group border-b border-black/5 transition-colors hover:bg-black/2"
              >
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-black/60">{member.order}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full border border-black/5">
                      <img
                        src={member.photo || ""}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-normal text-black">
                        {member.name}
                      </span>
                      <span className="text-xs text-black/40">
                        {member.department?.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-xs text-black/60">{member.role}</span>
                </TableCell>
                <TableCell className="max-w-xs px-6 py-4">
                  <p className="line-clamp-1 text-xs text-black/40">
                    {member.about || "No description"}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <TableActionButtons
                    onEdit={() => onEdit(member)}
                    onDelete={() => handleDeleteClick(member)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {memberToDelete?.name}? This
              action cannot be undone and will permanently remove all their
              information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
