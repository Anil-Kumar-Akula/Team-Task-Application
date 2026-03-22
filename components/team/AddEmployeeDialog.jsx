import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Loader2, UserPlus } from 'lucide-react';

const DEPARTMENTS = ['Engineering','Design','Marketing','Sales','HR','Finance','Operations','Support'];

export default function AddEmployeeDialog({ open, onOpenChange, onCreated, editEmployee }) {
  const [form, setForm] = useState(editEmployee || { name:'', email:'', phone:'', department:'Engineering' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setLoading(true);
    if (editEmployee) await base44.entities.Employee.update(editEmployee.id, form);
    else await base44.entities.Employee.create({ ...form, is_active: true });
    setForm({ name:'', email:'', phone:'', department:'Engineering' });
    setLoading(false); onOpenChange(false); onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{editEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div><Label>Full Name *</Label><Input className="mt-1.5" placeholder="John Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div><Label>Email *</Label><Input className="mt-1.5" type="email" placeholder="john@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><Label>Phone (with country code)</Label><Input className="mt-1.5" placeholder="+919876543210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <div><Label>Department</Label>
            <Select value={form.department} onValueChange={v=>setForm({...form,department:v})}>
              <SelectTrigger className="mt-1.5"><SelectValue/></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map(d=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={()=>onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading||!form.name||!form.email}>
            {loading?<Loader2 className="w-4 h-4 animate-spin mr-2"/>:<UserPlus className="w-4 h-4 mr-2"/>}
            {editEmployee ? 'Update' : 'Add Employee'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}