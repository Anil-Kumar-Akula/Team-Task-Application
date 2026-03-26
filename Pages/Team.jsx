import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Mail, Phone, Building2, Pencil, Users } from 'lucide-react';
import AddEmployeeDialog from '@/components/team/AddEmployeeDialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function Team() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState('');

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.Employee.list('-created_date'),
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-created_date', 200),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['employees'] });
  const filtered = employees.filter(e => !search || e.name?.toLowerCase().includes(search.toLowerCase()) || e.email?.toLowerCase().includes(search.toLowerCase()));
  const getTaskCount = (id) => tasks.filter(t => t.assigned_to_id === id && t.status !== 'verified').length;

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_,i)=><Skeleton key={i} className="h-36 rounded-xl"/>)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Team</h1><p className="text-muted-foreground text-sm mt-1">{employees.length} employees</p></div>
        <Button onClick={()=>{setEditEmployee(null);setAddOpen(true);}} className="shrink-0"><UserPlus className="w-4 h-4 mr-2"/>Add Employee</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
        <Input placeholder="Search employees..." className="pl-10" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      {filtered.length === 0
        ? <div className="text-center py-16 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>No employees found.</p></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(emp=>(
              <Card key={emp.id} className="p-5 border-none shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-semibold text-sm">{emp.name?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <h3 className="font-semibold">{emp.name}</h3>
                      {emp.department && <Badge variant="outline" className="mt-1 text-xs font-normal"><Building2 className="w-3 h-3 mr-1"/>{emp.department}</Badge>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={()=>{setEditEmployee(emp);setAddOpen(true);}}><Pencil className="w-4 h-4"/></Button>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5"/><span className="truncate">{emp.email}</span></div>
                  {emp.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5"/><span>{emp.phone}</span></div>}
                </div>
                <div className="mt-3 pt-3 border-t border-border"><span className="text-xs text-muted-foreground">{getTaskCount(emp.id)} active tasks</span></div>
              </Card>
            ))}
          </div>
      }
      <AddEmployeeDialog open={addOpen} onOpenChange={v=>{if(!v){setAddOpen(false);setEditEmployee(null);}}} onCreated={refresh} editEmployee={editEmployee}/>
    </div>
  );
}
