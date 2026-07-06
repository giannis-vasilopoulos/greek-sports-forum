import { copy } from "@/lib/copy";

const t = copy.thread.post;

interface BestFirstHelperProps {
  visibleCount: number;
  totalCount: number;
  shouldShowExpand: boolean;
  showAllTopLevel: boolean;
}

export function BestFirstHelper({
  visibleCount,
  totalCount,
  shouldShowExpand,
  showAllTopLevel,
}: BestFirstHelperProps) {
  if (!shouldShowExpand || showAllTopLevel) {
    return null;
  }

  return (
    <p className="text-muted-foreground text-[12px]">
      {t.showingBestReplies(visibleCount, totalCount)}
    </p>
  );
}

interface BestFirstExpandButtonProps {
  totalCount: number;
  shouldShowExpand: boolean;
  showAllTopLevel: boolean;
  onShowAll: () => void;
}

export function BestFirstExpandButton({
  totalCount,
  shouldShowExpand,
  showAllTopLevel,
  onShowAll,
}: BestFirstExpandButtonProps) {
  if (!shouldShowExpand || showAllTopLevel) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onShowAll}
      className="text-primary hover:text-primary/80 cursor-pointer self-start text-[12px] font-medium transition-colors duration-200"
    >
      {t.showAllReplies(totalCount)}
    </button>
  );
}
