"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  SERVICE_SKILL_LABELS,
  SERVICE_TECHNICIAN_STATUS_LABELS,
  type ServiceTechnician,
  type ServiceTechnicianStatus,
} from "@/lib/mock-data/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ALL_SKILLS = Object.keys(SERVICE_SKILL_LABELS);

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (tech: ServiceTechnician) => void;
  editTechnician: ServiceTechnician | null;
};

export function ServiceTechnicianFormSheet({ open, onClose, onSave, editTechnician }: Props) {
  const [territory, setTerritory] = useState("");
  const [status, setStatus] = useState<ServiceTechnicianStatus>("active");
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!open || !editTechnician) return;
    setTerritory(editTechnician.defaultTerritory);
    setStatus(editTechnician.status);
    setSkills([...editTechnician.skills]);
    setCertifications(editTechnician.certifications.join(", "));
    setPhone(editTechnician.phone);
  }, [open, editTechnician]);

  if (!editTechnician) return null;

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = () => {
    if (!territory.trim()) {
      toast.error("Territory is required");
      return;
    }
    onSave({
      ...editTechnician,
      defaultTerritory: territory.trim(),
      status,
      skills,
      certifications: certifications.split(",").map((c) => c.trim()).filter(Boolean),
      phone: phone.trim(),
    });
    toast.success("Technician profile updated");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg [&>button.absolute]:hidden"
      >
        <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 pb-4 pt-3">
          <div className="shrink-0 border-b border-border pb-4">
            <h2 className="font-semibold">Edit Service Profile</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {editTechnician.name} · {editTechnician.employeeId} — HR master data is read-only
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground">Default territory</label>
              <Input value={territory} onChange={(e) => setTerritory(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Service status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as ServiceTechnicianStatus)} className="mt-1 h-8 w-full text-xs">
                  {(Object.keys(SERVICE_TECHNICIAN_STATUS_LABELS) as ServiceTechnicianStatus[]).map((s) => (
                    <option key={s} value={s}>{SERVICE_TECHNICIAN_STATUS_LABELS[s]}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 h-8 text-xs" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Skills</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ALL_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${
                      skills.includes(skill)
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                        : "border-input bg-muted/30 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {SERVICE_SKILL_LABELS[skill]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground">Certifications (comma-separated)</label>
              <Input value={certifications} onChange={(e) => setCertifications(e.target.value)} className="mt-1 h-8 text-xs" />
            </div>
          </div>

          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1" onClick={handleSave}>
              Save profile
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
