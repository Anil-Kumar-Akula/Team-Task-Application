import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ShieldCheck, RotateCcw, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function VerifyTaskDialog({ open, onOpenChange, task, onDone }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    const newStatus = action === 'verify' ? 'verified' : 'reopened';
    await base44.entities.Task.update(task.id, { status: newStatus, manager_note: note || undefined });
    try {
      await base44.integrations.Core.SendEmail({
        to: task.assigned_to_email,
        subject: action === 'verify' ? `Task Verified: ${task.title}` : `Task Reopened: ${task.title}`,
        body: action === 'verify'
          ? `<h2>Task Verified ✅</h2><p>Hi ${task.assigned_to_name}, your task "<strong>${task.title}</strong>" has been verified. Great work!${note ? `<br/>Note: ${note}` : ''}</p>`
          : `<h2>Task Reopened 🔄</h2><p>Hi ${task.assigned_to_name}, your task "<strong>${task.title}</strong>" has been reopened. Please review and redo it.${note ? `<br/>Note: ${note}` : ''}</p>`
      });
    } catch(e) {}
    setNote(''); setLoading(false); onOpenChange(false); onDone();
  };

  if (!task) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Review Task: {task.title}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm text-muted-foreground">Completed by <strong>{task.assigned_to_name}</strong></p>
          {task.description && <p className="text-sm bg-muted p-3 rounded-lg">{task.description}</p>}
          <div><Label>Manager Note (optional)</Label><Textarea className="mt-1.5" placeholder="Add a note..." value={note} onChange={e=>setNote(e.target.value)}/></div>
        </div>
        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={()=>handleAction('reopen')} disabled={loading} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            {loading?<Loader2 className="w-4 h-4 animate-spin mr-2"/>:<RotateCcw className="w-4 h-4 mr-2"/>}Reopen
          </Button>
          <Button onClick={()=>handleAction('verify')} disabled={loading}>
            {loading?<Loader2 className="w-4 h-4 animate-spin mr-2"/>:<ShieldCheck className="w-4 h-4 mr-2"/>}Verify & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}