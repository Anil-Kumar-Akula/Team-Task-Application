import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, ShieldCheck, RotateCcw } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import VerifyTaskDialog from '@/components/tasks/VerifyTaskDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageTasks() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [verifyTask, setVerifyTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date', 200),
  });
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list(),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.assigned_to_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (isLoading) return <div className="space-y-4">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-28 rounded-xl"/>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">Create, assign and review team tasks</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0"><Plus className="w-4 h-4 mr-2"/>New Task</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input placeholder="Search tasks or employees..." className="pl-10" value={search} onChange={e=>setSearch(e.target.value)}/>
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
        {filtered.map(task => (
          <TaskCard key={task.id} task={task} actions={
            task.status === 'completed'
              ? <Button size="sm" onClick={()=>setVerifyTask(task)}><ShieldCheck className="w-4 h-4 mr-1.5"/>Review</Button>
              : null
          }/>
        ))}
      </div>
      <CreateTaskDialog open={createOpen} onOpenChange={setCreateOpen} employees={employees} onCreated={refresh}/>
      <VerifyTaskDialog open={!!verifyTask} onOpenChange={v=>{if(!v)setVerifyTask(null)}} task={verifyTask} onDone={refresh}/>
    </div>
  );
}