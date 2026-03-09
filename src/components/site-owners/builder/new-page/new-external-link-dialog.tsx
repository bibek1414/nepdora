import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewExternalLinkDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLinkCreated?: (url: string) => void;
}

export const NewExternalLinkDialog: React.FC<NewExternalLinkDialogProps> = ({
  open,
  onOpenChange,
  onLinkCreated,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalIsOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalIsOpen(newOpen);
    }

    if (!newOpen) {
      setExternalUrl("");
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (externalUrl.trim()) {
      let finalUrl = externalUrl.trim();
      if (
        !finalUrl.startsWith("http://") &&
        !finalUrl.startsWith("https://") &&
        !finalUrl.startsWith("mailto:") &&
        !finalUrl.startsWith("tel:")
      ) {
        finalUrl = `https://${finalUrl}`;
      }
      onLinkCreated?.(finalUrl);
      handleOpenChange(false);
      setExternalUrl("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onPointerDownOutside={e => e.stopPropagation()}
        onInteractOutside={e => e.stopPropagation()}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Add External Link</DialogTitle>
          <DialogDescription>
            Enter an external URL. It will be opened in a new tab if
            appropriate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-2">
            <Input
              value={externalUrl}
              onChange={e => setExternalUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!externalUrl.trim()}>
              Add Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
