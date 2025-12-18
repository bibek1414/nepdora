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
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100 hover:bg-transparent">
            <TableHead className="w-16 px-6 py-4 font-semibold text-slate-700">
              Order
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Member Info
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Role
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              About
            </TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-12 text-center text-slate-500"
              >
                No team members found. Click "Add Team Member" to get started.
              </TableCell>
            </TableRow>
          ) : (
            sortedMembers.map(member => (
              <TableRow
                key={member.id}
                className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
              >
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className="border-slate-200 font-medium text-slate-600"
                  >
                    {member.order}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <TableUserCell
                    imageSrc={member.photo || undefined}
                    fallback={member.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase()}
                    title={member.name}
                    subtitle={member.department?.name}
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="secondary"
                    className="rounded-md bg-slate-100 font-medium text-slate-600 hover:bg-slate-200"
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs px-6 py-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
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
    </TableWrapper>
  );
};
