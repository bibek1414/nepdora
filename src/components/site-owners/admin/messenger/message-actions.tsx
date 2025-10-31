"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { CreateManualOrderDialog } from "@/components/site-owners/admin/manual-order/create-manual-order-dialog";

interface MessageActionsProps {
  message: string;
}

export function MessageActions({ message }: MessageActionsProps) {
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  return (
    <>
      <div className="mt-2 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateOrder(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Create Order
        </Button>

        {/* You can add more actions here */}
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          Reply
        </Button>
      </div>

      {/* Manual Order Dialog */}
      {showCreateOrder && (
        <CreateManualOrderDialog
          open={showCreateOrder}
          onOpenChange={setShowCreateOrder}
          initialMessage={message}
        />
      )}
    </>
  );
}
