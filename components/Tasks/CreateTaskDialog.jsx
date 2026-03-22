import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Loader2, Send } from 'lucide-react';

export default function CreateTaskDialog({ open, onOpenChange, employees, onCreated }) {
  const [form, setForm] = useState({ title:'', description:'', assigned_to_id:'', priority:'medium', due_date:'' });
  const [loading, setLoading] = useState(false);
  const selectedEmployee = employees.find(e => e.id === form.assigned_to_id);

  const handleSubmit = async () => {
    if (!form.title || !form.assigned_to_id) return;
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.Task.create({
      ...form,
      assigned_to_name: selectedEmployee.name,
      assigned_to_email: selectedEmployee.email,
      assigned_to_phone: selectedEmployee.phone || '',
      status: 'pending',
      manager_email: user.email,
    });

    // Email notification
    try {
      await base44.integrations.Core.SendEmail({
        to: selectedEmployee.email,
        subject: `New Task Assigned: ${form.title}`,
        body: `<h2>New Task Assigned</h2><p>Hi ${selectedEmployee.name},</p><p>Task: <strong>${form.title}</strong></p><p>${form.description || ''}</p><p>Priority: ${form.priority.toUpperCase()}</p><p>Due: ${form.due_date || 'N/A'}</p>`
      });
    } catch(e) {}

    // WhatsApp message
    if (selectedEmployee.phone) {
      const msg = encodeURIComponent(`Hi ${selectedEmployee.name}, new task: "${form.title}". Priority: ${form.priority}. ${form.due_date ? `Due: ${form.due_date}.` : ''} Check the app for details.`);
      window.open(`https://wa.me/${selectedEmployee.phone.replace(/[^0-9]/g,'')}?text=${msg}`, '_blank');
    }

    setForm({ title:'', description:'', assigned_to_id:'', priority:'medium', due_date:'' });
    setLoading(false);
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="text-xl">Create New Task</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div><Label>Task Title *</Label><Input className="mt-1.5" placeholder="Enter task title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div><Label>Description</Label><Textarea className="mt-1.5 min-h-[80px]" placeholder="Describe the task..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Assign To *</Label>
              <Select value={form.assigned_to_id} onValueChange={v=>setForm({...form,assigned_to_id:v})}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select employee"/></SelectTrigger>
                <SelectContent>{employees.filter(e=>e.is_active!==false).map(emp=><SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Priority</Label>
              <Select value={form.priority} onValueChange={v=>setForm({...form,priority:v})}>
                <SelectTrigger className="mt-1.5"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Due Date</Label><Input type="date" className="mt-1.5" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/></div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading||!form.title||!form.assigned_to_id}>
            {loading?<Loader2 className="w-4 h-4 animate-spin mr-2"/>:<Send className="w-4 h-4 mr-2"/>}Create & Notify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}