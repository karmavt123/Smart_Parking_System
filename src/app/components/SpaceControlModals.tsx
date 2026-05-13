import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export type DestStatus = 'active' | 'inactive' | 'maintenance';

const inp = 'w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors';

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="size-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Footer({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-xl shrink-0">
      <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors">Cancel</button>
      <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">{label}</button>
    </div>
  );
}

// ── Zone Modal ────────────────────────────────────────────────────────────────
export interface ZoneData {
  id: string;
  fullName: string;
  type: string;
  areaCapacities: number[];
  areaNames?: string[];
}

interface ZoneModalProps {
  mode: 'create' | 'edit';
  initial?: ZoneData;
  existingIds: string[];
  onSave: (d: ZoneData) => void;
  onClose: () => void;
}

export function ZoneModal({ mode, initial, existingIds, onSave, onClose }: ZoneModalProps) {
  const [id, setId] = useState(initial?.id ?? '');
  const [fullName, setFullName] = useState(initial?.fullName ?? '');
  const [type, setType] = useState(initial?.type ?? 'General Parking');
  const [areas, setAreas] = useState<{ name: string; capacity: number }[]>(() => {
    const caps = initial?.areaCapacities ?? [60, 60];
    const names = initial?.areaNames ?? [];
    return caps.map((cap, i) => ({
      name: names[i] ?? `Area ${String.fromCharCode(65 + i)}`,
      capacity: cap,
    }));
  });
  const [err, setErr] = useState<Record<string, string>>({});

  // When in create mode sync with area count changes
  useEffect(() => {
    if (mode === 'create') {
      // nothing extra needed here; handled by add/remove buttons
    }
  }, [mode]);

  const total = areas.reduce((a, c) => a + c.capacity, 0);

  const addArea = () => {
    setAreas(prev => [...prev, { name: `Area ${String.fromCharCode(65 + prev.length)}`, capacity: 60 }]);
  };

  const removeArea = () => {
    setAreas(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const setAreaName = (i: number, name: string) =>
    setAreas(p => p.map((a, j) => (j === i ? { ...a, name } : a)));

  const setAreaCap = (i: number, capacity: number) =>
    setAreas(p => p.map((a, j) => (j === i ? { ...a, capacity } : a)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!id.trim()) e2.id = 'Zone ID is required';
    else if (mode === 'create' && existingIds.includes(id.toUpperCase())) e2.id = 'ID already exists';
    if (!fullName.trim()) e2.fullName = 'Name is required';
    if (areas.some(a => a.capacity < 1)) e2.caps = 'Each area must have capacity ≥ 1';
    if (areas.some(a => !a.name.trim())) e2.names = 'Each area must have a name';
    if (Object.keys(e2).length) { setErr(e2); return; }
    onSave({
      id: id.toUpperCase(),
      fullName,
      type,
      areaCapacities: areas.map(a => a.capacity),
      areaNames: areas.map(a => a.name),
    });
  };

  return (
    <Overlay title={mode === 'create' ? 'Create New Zone' : 'Edit Zone'} onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col min-h-0">
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Zone ID (e.g. F)" error={err.id}>
              <input className={inp} value={id} maxLength={2} disabled={mode === 'edit'}
                onChange={e => setId(e.target.value.toUpperCase())} placeholder="F" />
            </Field>
            <Field label="Type">
              <select className={inp} value={type} onChange={e => setType(e.target.value)}>
                {['General Parking', 'Faculty Reserved', 'Staff Reserved', 'Disabled Parking', 'EV Charging'].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Full Name" error={err.fullName}>
            <input className={inp} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Zone F - Engineering Block" />
          </Field>

          {/* Area Configuration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Areas ({areas.length})</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={removeArea}
                  className="size-7 flex items-center justify-center border border-border rounded hover:bg-muted transition-colors text-sm font-medium disabled:opacity-40"
                  disabled={areas.length <= 1}>−</button>
                <span className="w-6 text-center text-sm font-semibold">{areas.length}</span>
                <button type="button" onClick={addArea}
                  className="size-7 flex items-center justify-center border border-border rounded hover:bg-muted transition-colors text-sm font-medium disabled:opacity-40"
                  disabled={areas.length >= 8}>+</button>
              </div>
            </div>
            <div className="space-y-2 p-3 bg-muted/40 rounded-lg">
              {/* Column headers */}
              <div className="flex items-center gap-3 pb-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase w-6 shrink-0">#</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase flex-1">Area Name</span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase w-20 text-right">Capacity</span>
              </div>
              {areas.map((area, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-muted-foreground w-6 shrink-0 text-center">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    value={area.name}
                    onChange={e => setAreaName(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={`Area ${String.fromCharCode(65 + i)}`}
                  />
                  <input
                    type="number" min={1} max={999} value={area.capacity}
                    onChange={e => setAreaCap(i, Math.max(1, +e.target.value || 1))}
                    className="w-20 px-2 py-1.5 bg-background border border-border rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
              {err.caps && <p className="text-xs text-destructive">{err.caps}</p>}
              {err.names && <p className="text-xs text-destructive">{err.names}</p>}
              <div className="flex justify-between pt-2 border-t border-border mt-2">
                <span className="text-[13px] text-muted-foreground">Total Capacity</span>
                <span className="text-sm font-semibold">{total} slots</span>
              </div>
            </div>
          </div>
        </div>
        <Footer onClose={onClose} label={mode === 'create' ? 'Create Zone' : 'Save Changes'} />
      </form>
    </Overlay>
  );
}

// ── Area Modal ────────────────────────────────────────────────────────────────
export interface AreaData { name: string; description: string; capacity?: number }

interface AreaModalProps { mode: 'create' | 'edit'; initial?: AreaData; onSave: (d: AreaData) => void; onClose: () => void }

export function AreaModal({ mode, initial, onSave, onClose }: AreaModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [desc, setDesc] = useState(initial?.description ?? '');
  const [cap, setCap] = useState(initial?.capacity ?? 0);
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Name is required'); return; }
    onSave({ name, description: desc, capacity: cap });
  };

  return (
    <Overlay title={mode === 'create' ? 'Create New Area' : 'Edit Area'} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="p-6 space-y-4">
          <Field label="Area Name" error={err}>
            <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Area C" />
          </Field>
          <Field label="Description">
            <input className={inp} value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Near north entrance" />
          </Field>
          {mode === 'edit' && (
            <Field label="Capacity (slots)" hint="Tổng số chỗ đỗ của Area này">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCap(v => Math.max(0, v - 1))}
                  className="size-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors text-base font-semibold shrink-0"
                >−</button>
                <input
                  type="number" min={0} max={9999} value={cap}
                  onChange={e => setCap(Math.max(0, +e.target.value || 0))}
                  className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setCap(v => Math.min(9999, v + 1))}
                  className="size-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors text-base font-semibold shrink-0"
                >+</button>
              </div>
            </Field>
          )}
        </div>
        <Footer onClose={onClose} label={mode === 'create' ? 'Create Area' : 'Save Changes'} />
      </form>
    </Overlay>
  );
}

// ── Row Modal ─────────────────────────────────────────────────────────────────
export interface RowData { name: string; type: string; capacity: number; status: DestStatus }

interface RowModalProps { mode: 'create' | 'edit'; initial?: RowData; onSave: (d: RowData) => void; onClose: () => void }

export function RowModal({ mode, initial, onSave, onClose }: RowModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [type, setType] = useState(initial?.type ?? 'General');
  const [cap, setCap] = useState(initial?.capacity ?? 10);
  const [status, setStatus] = useState<DestStatus>(initial?.status ?? 'active');
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setErr('Name is required'); return; }
    onSave({ name, type, capacity: cap, status });
  };

  return (
    <Overlay title={mode === 'create' ? 'Create New Row' : 'Edit Row'} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="p-6 space-y-4">
          <Field label="Row Name" error={err}>
            <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Row 4" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select className={inp} value={type} onChange={e => setType(e.target.value)}>
                {['General', 'Reserved', 'Disabled', 'EV Charging'].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inp} value={status} onChange={e => setStatus(e.target.value as DestStatus)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </Field>
          </div>
          <Field label="Capacity (slots)">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCap(v => Math.max(1, v - 1))}
                className="size-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors text-base font-semibold shrink-0"
              >−</button>
              <input
                type="number" min={1} max={999} value={cap}
                onChange={e => setCap(Math.max(1, +e.target.value || 1))}
                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setCap(v => Math.min(999, v + 1))}
                className="size-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors text-base font-semibold shrink-0"
              >+</button>
            </div>
          </Field>
        </div>
        <Footer onClose={onClose} label={mode === 'create' ? 'Create Row' : 'Save Changes'} />
      </form>
    </Overlay>
  );
}
