import { Badge } from '@/components/ui/badge';

const config = {
  low:    'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-sky-100 text-sky-700 border-sky-200',
  high:   'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
};

export default function PriorityBadge({ priority }) {
  return (
    <Badge variant="outline" className={`${config[priority]||config.medium} font-medium px-2.5 py-0.5 capitalize`}>
      {priority}
    </Badge>
  );
}