import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from '@/components/tasks/TaskCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, CheckCircle2, Loader2, ListTodo, Filter } from 'lucide-react';

export default function MyTasks() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date', 200),
  });

  const myTasks = allTasks.filter(t => t.assigned_to_email === user?.email);
  const filtered = myTasks.filter(t => statusFilter === 'all' || t.status === statusFilter);
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const handleStatusChange = async (task, newStatus) => {
    setUpdatingId(task.id);
    await base44.entities.Task.update(task.id, {
      status: newStatus,
      ...(newStatus === 'completed' ? { completed_date: new Date().toISOString() } : {})
    });
    if (newStatus === 'completed' && task.manager_email) {
      try {
        await base44.integrations.Core.SendEmail({
          to: task.manager_email,
          subject: `Task Completed: ${task.title}`,
          body: `<h2>Task Completed ✅</h2><p><strong>${task.assigned_to_name}</strong> has completed the task: <strong>${task.title}</strong>.</p><p>Please log in to verify.</p>`
        });
      } catch(e) {}
    }
    setUpdatingId(null);
    refresh();
  };

  if (isLoading || !user) return <div className="space-y-4">{Array(3).fill(0).map((_,i)=><Skeleton key={i} className="h-28 rounded-xl"/>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">{myTasks.length} tasks assigned to you</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground"/>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="reopened">Reopened</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-3">
        {filtered.length === 0
          ? <div className="text-center py-16 text-muted-foreground"><ListTodo className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No tasks found.</p></div>
          : filtered.map(task => (
            <TaskCard key={task.id} task={task} actions={
              <>
                {(task.status === 'pending' || task.status === 'reopened') && (
                  <Button size="sm" onClick={()=>handleStatusChange(task,'in_progress')} disabled={updatingId===task.id}>
                    {updatingId===task.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5"/> : <Play className="w-4 h-4 mr-1.5"/>}Accept & Start
                  </Button>
                )}
                {task.status === 'in_progress' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>handleStatusChange(task,'completed')} disabled={updatingId===task.id}>
                    {updatingId===task.id ? <Loader2 className="w-4 h-4 animate-spin mr-1.5"/> : <CheckCircle2 className="w-4 h-4 mr-1.5"/>}Mark Complete
                  </Button>
                )}
              </>
            }/>
          ))
        }
      </div>
    </div>
  );
}