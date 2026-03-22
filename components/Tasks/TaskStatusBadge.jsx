import { Badge } from '@/components/ui/badge';
import { Clock, Play, CheckCircle2, ShieldCheck, RotateCcw } from 'lucide-react';

const config = {
  pending:     { label:'Pending',     icon:Clock,       className:'bg-amber-100 text-amber-700 border-amber-200' },
  in_progress: { label:'In Progress', icon:Play,        className:'bg-blue-100 text-blue-700 border-blue-200' },
  completed:   { label:'Completed',   icon:CheckCircle2,className:'bg-green-100 text-green-700 border-green-200' },
  verified:    { label:'Verified',    icon:ShieldCheck, className:'bg-purple-100 text-purple-700 border-purple-200' },
  reopened:    { label:'Reopened',    icon:RotateCcw,   className:'bg-red-100 text-red-700 border-red-200' },
};

export default function TaskStatusBadge({ status }) {
  const { label, icon: Icon, className } = config[status] || config.pending;
  return (
    <Badge variant="outline" className={`${className} gap-1.5 font-medium px-3 py-1`}>
      <Icon className="w-3.5 h-3.5"/>{label}
    </Badge>
  );
}