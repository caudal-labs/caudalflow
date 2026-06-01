import { useTranslation } from 'react-i18next';
import { GitBranch } from 'lucide-react';

interface BranchOption {
  topic: string;
  prompt?: string;
}

interface BranchProposalArgs {
  parentNodeId?: string;
  parentTopic?: string;
  rationale?: string;
  options?: BranchOption[];
}

export function BranchProposalCard({ args }: { args: BranchProposalArgs }) {
  const { t } = useTranslation();
  const options = args.options ?? [];
  return (
    <div className="my-2 rounded-lg border border-accent-500/30 bg-surface-950 p-3 text-text-primary shadow-lg">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <GitBranch size={15} className="text-accent-400" />
        <span>{t('branch.branchProposal')}{args.parentTopic ? `: ${args.parentTopic}` : ''}</span>
      </div>
      {args.rationale && (
        <p className="mb-2 text-xs leading-5 text-text-secondary">{args.rationale}</p>
      )}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt, i) => (
            <span
              key={`${opt.topic}-${i}`}
              className="rounded-full border border-accent-500/40 bg-surface-800 px-2 py-0.5 text-[11px] text-accent-300"
            >
              {opt.topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
