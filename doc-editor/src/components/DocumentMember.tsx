import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import type { GetDocument } from "@/types/types";
import { useCallback, useMemo, useState } from "react";
import { useDeleteMemberMutation } from "@/store/api/documentApi";

interface HeaderProps {
  document?: GetDocument;
}

const DocumentMember = ({ document }: HeaderProps) => {
  const [deleteMember] = useDeleteMemberMutation();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleDelete = useCallback(
    async (memberId: string) => {
      if (!document?.document._id) return;
      const documentId = document.document._id;

      try {
        setDeletingIds((s) => [...s, memberId]);
        await deleteMember({ documentId, memberId }).unwrap();
      } catch (err: any) {
        console.error("Delete member failed:", err);
      } finally {
        setDeletingIds((s) => s.filter((id) => id !== memberId));
      }
    },
    [document, deleteMember]
  );

  const members = useMemo(() => document?.document.member || [], [document]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full flex-wrap gap-2">
        {members.map((user) => {
          const isDeleting = deletingIds.includes(user._id);
          return (
            <Badge
              key={user._id}
              variant="secondary"
              className={`flex items-center gap-1 rounded-full
                shadow-[0_4px_12px_rgba(0,0,0,0.25)]
                transition-all duration-200
                hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)]
                ${isDeleting ? "opacity-60 pointer-events-none" : ""}
              `}
            >
              <span className="font-medium text-sm truncate max-w-[140px]">
                {user.email}
              </span>

              <button
                type="button"
                onClick={() => handleDelete(user._id)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted transition focus:outline-none"
                aria-label={`Remove ${user.email}`}
                disabled={isDeleting}
              >
                <X size={13} />
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentMember;
