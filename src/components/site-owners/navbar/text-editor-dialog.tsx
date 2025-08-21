"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newText: string) => void;
  initialText: string;
  title: string;
  label: string;
  description?: string;
}

export const TextEditorDialog: React.FC<TextEditorDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialText,
  title,
  label,
  description,
}) => {
  const [text, setText] = useState(initialText);

  // Reset the internal state when the dialog is opened or the initial text changes
  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);

  const handleSave = () => {
    onSave(text);
    onClose();
  };

  // This handles closing the dialog via the 'X' button or overlay click
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-input" className="text-right">
              {label}
            </Label>
            <Input
              id="text-input"
              value={text}
              onChange={e => setText(e.target.value)}
              className="col-span-3"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
