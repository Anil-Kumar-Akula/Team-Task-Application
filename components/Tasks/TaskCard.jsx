import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskStatusBadge from './TaskStatusBadge';
import PriorityBadge from './PriorityBadge';
import { Calendar, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskCard({ task, actions }) {
  return (
    <Card className="p-5 border-none shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <TaskStatusBadge status={task.status}/>
            <PriorityBadge priority={task.priority||'medium'}/>
          </div>
          <h3 className="font-semibold text-base truncate">{task.title}</h3>
          {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5"/>{task.assigned_to_name}</span>
            {task.due_date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/>{format(new Date(task.due_date),'MMM d, yyyy')}</span>}
          </div>
          {task.manager_note && (
            <div className="mt-2 px-3 py-2 bg-muted rounded-lg text-xs text-muted-foreground flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0"/><span>{task.manager_note}</span>
            </div>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">{actions}</div>}
      </div>
    </Card>
  );
}