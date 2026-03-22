import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard from '@/components/tasks/TaskCard';
import { ClipboardList, Clock, Play, CheckCircle2, ShieldCheck, Users, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: tasks = [], isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date', 100),
  });
  const { data: employees = [], isLoading: loadingEmp } = useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list(),
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending' || t.status === 'reopened').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    verified: tasks.filter(t => t.status === 'verified').length,
    employees: employees.filter(e => e.is_active !== false).length,
  };

  const urgentTasks = tasks.filter(t => (t.status === 'pending' || t.status === 'reopened') && t.priority === 'urgent');
  const recentTasks = tasks.slice(0, 5);

  if (loadingTasks || loadingEmp) return <div className="space-y-4">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-24 rounded-xl"/>)}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your team's task progress</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Tasks" value={stats.total} icon={ClipboardList} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="text-amber-600" bgColor="bg-amber-50" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Play} color="text-blue-600" bgColor="bg-blue-50" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="text-green-600" bgColor="bg-green-50" />
        <StatCard title="Verified" value={stats.verified} icon={ShieldCheck} color="text-purple-600" bgColor="bg-purple-50" />
        <StatCard title="Team Size" value={stats.employees} icon={Users} color="text-indigo-600" bgColor="bg-indigo-50" />
      </div>
      {urgentTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-destructive"/><h2 className="text-lg font-semibold">Urgent Tasks</h2></div>
          <div className="space-y-3">{urgentTasks.map(t=><TaskCard key={t.id} task={t}/>)}</div>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Tasks</h2>
          <Link to="/tasks"><Button variant="ghost" size="sm">View All →</Button></Link>
        </div>
        <div className="space-y-3">
          {recentTasks.length === 0
            ? <div className="text-center py-12 text-muted-foreground"><ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No tasks yet.</p><Link to="/tasks"><Button className="mt-4">Go to Manage Tasks</Button></Link></div>
            : recentTasks.map(t=><TaskCard key={t.id} task={t}/>)
          }
        </div>
      </div>
    </div>
  );
}
