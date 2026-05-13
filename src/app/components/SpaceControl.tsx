import { ChevronRight, ChevronDown, MapPin, Layers, Grid3x3, Plus, Edit, Trash2, WifiOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ZoneModal, AreaModal, RowModal, type DestStatus, type ZoneData } from './SpaceControlModals';

interface Destination { id: string; name: string; type: string; capacity: number; occupied: number; status: DestStatus }
interface Slot { id: string; name: string; description: string; destinations: Destination[]; totalCapacity: number; expanded?: boolean }
interface Stage { id: string; fullName: string; type: string; total: number; occupied: number; slots: Slot[]; expanded?: boolean; areaCapacities?: number[]; areaNames?: string[] }
interface ParkingData { zones: any[] }
interface SpaceControlProps {
  parkingData: ParkingData;
  onAddZone?: (z: { id: string; name: string; fullName: string; type: string; total: number; areaCapacities: number[] }) => void;
  onUpdateZone?: (id: string, u: { fullName: string; type: string }) => void;
  onDeleteZone?: (id: string) => void;
}

function getZoneLayout(zoneId: string) {
  const L: any = { A:{areas:2,rowsPerArea:3}, B:{areas:3,rowsPerArea:2}, C:{areas:2,rowsPerArea:4}, D:{areas:3,rowsPerArea:2}, E:{areas:2,rowsPerArea:3} };
  return L[zoneId] || { areas: 2, rowsPerArea: 3 };
}
function areaLabel(i: number) { return String.fromCharCode(65 + i); }

function initStages(zones: any[]): Stage[] {
  return zones.map(zone => {
    const lay = zone.areaCapacities
      ? { areas: zone.areaCapacities.length, rowsPerArea: 3 }
      : getZoneLayout(zone.id);

    const slots: Slot[] = [];
    let cursor = 0;

    for (let ai = 0; ai < lay.areas; ai++) {
      // Use exact areaCapacities if available, else divide evenly
      const aSize = zone.areaCapacities
        ? zone.areaCapacities[ai]
        : (ai === lay.areas - 1 ? zone.slots.length - cursor : Math.floor(zone.slots.length / lay.areas));
      const aSlots = zone.slots.slice(cursor, cursor + aSize);
      cursor += aSize;

      const baseRow = Math.floor(aSlots.length / lay.rowsPerArea);
      const destinations: Destination[] = [];
      for (let ri = 0; ri < lay.rowsPerArea; ri++) {
        const rStart = ri * baseRow;
        const rEnd = ri === lay.rowsPerArea - 1 ? aSlots.length : rStart + baseRow;
        const rSlots = aSlots.slice(rStart, rEnd);
        destinations.push({
          id: `dest-${zone.id}-${ai}-${ri}`,
          name: `Row ${ri + 1}`,
          type: 'General',
          capacity: rSlots.length,
          occupied: rSlots.filter((s: any) => s.occupied).length,
          status: 'active',
        });
      }
      const areaName = zone.areaNames?.[ai] ?? `Area ${areaLabel(ai)}`;
      slots.push({
        id: `slot-${zone.id}-${ai}`,
        name: areaName,
        description: `Parking area ${areaLabel(ai)}`,
        totalCapacity: aSlots.length,
        expanded: false,
        destinations,
      });
    }
    return { id: zone.id, fullName: zone.fullName, type: zone.type, total: zone.total, occupied: zone.occupied, slots, expanded: false, areaCapacities: zone.areaCapacities, areaNames: zone.areaNames };
  });
}

function statusColor(s: string) {
  return s === 'active' ? 'bg-chart-2/10 text-chart-2' : s === 'maintenance' ? 'bg-chart-4/10 text-chart-4' : 'bg-muted text-muted-foreground';
}

type ZoneMs = { open:false } | { open:true; mode:'create'|'edit'; stage?: Stage };
type AreaMs = { open:false } | { open:true; mode:'create'|'edit'; stageId:string; slot?: Slot };
type RowMs  = { open:false } | { open:true; mode:'create'|'edit'; stageId:string; slotId:string; dest?: Destination };

export function SpaceControl({ parkingData, onAddZone, onUpdateZone, onDeleteZone }: SpaceControlProps) {
  const [stages, setStages] = useState<Stage[]>(initStages(parkingData.zones));
  const [zm, setZm] = useState<ZoneMs>({ open: false });
  const [am, setAm] = useState<AreaMs>({ open: false });
  const [rm, setRm] = useState<RowMs>({ open: false });

  useEffect(() => {
    setStages(prev => {
      const next = initStages(parkingData.zones);
      return next.map(ns => {
        const os = prev.find(s => s.id === ns.id);
        if (!os) return ns;
        return { ...ns, expanded: os.expanded, slots: ns.slots.map(sl => ({ ...sl, expanded: os.slots.find(x => x.id === sl.id)?.expanded || false })) };
      });
    });
  }, [parkingData]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const saveZone = (d: ZoneData) => {
    if (zm.open && zm.mode === 'create') {
      const total = d.areaCapacities.reduce((a, c) => a + c, 0);
      onAddZone?.({ ...d, name: d.id, total });
      toast.success(`Zone ${d.fullName} created!`);
    } else if (zm.open && zm.mode === 'edit' && zm.stage) {
      const stageId = zm.stage.id;
      onUpdateZone?.(stageId, { fullName: d.fullName, type: d.type });
      setStages(p => p.map(s => {
        if (s.id !== stageId) return s;
        // Rebuild slots to match new area count, names and capacities
        const prevSlots = s.slots;
        const newSlots = d.areaCapacities.map((cap, i) => {
          const areaName = d.areaNames?.[i] ?? `Area ${areaLabel(i)}`;
          const prev = prevSlots[i];
          // Preserve existing destinations if area already existed; recalculate totalCapacity
          const destinations: Destination[] = prev?.destinations ?? [];
          return {
            id: prev?.id ?? `slot-${stageId}-${i}-${Date.now()}`,
            name: areaName,
            description: prev?.description ?? `Parking area ${areaLabel(i)}`,
            totalCapacity: cap,
            expanded: prev?.expanded ?? false,
            destinations,
          };
        });
        const newTotal = d.areaCapacities.reduce((a, c) => a + c, 0);
        return { ...s, fullName: d.fullName, type: d.type, total: newTotal, areaCapacities: d.areaCapacities, areaNames: d.areaNames, slots: newSlots };
      }));
      toast.success('Zone updated');
    }
    setZm({ open: false });
  };

  const deleteZone = (stage: Stage) => {
    if (!window.confirm(`Delete "${stage.fullName}"? This cannot be undone.`)) return;
    setStages(p => p.filter(s => s.id !== stage.id));
    onDeleteZone?.(stage.id);
    toast.success(`Zone "${stage.fullName}" deleted`);
  };

  const saveArea = (d: { name: string; description: string; capacity?: number }) => {
    if (!am.open) return;
    setStages(p => p.map(st => st.id !== am.stageId ? st : {
      ...st,
      slots: am.mode === 'create'
        ? [...st.slots, { id: `slot-${am.stageId}-${Date.now()}`, name: d.name, description: d.description, totalCapacity: 0, expanded: false, destinations: [] }]
        : st.slots.map(sl => sl.id !== am.slot?.id ? sl : {
            ...sl,
            name: d.name,
            description: d.description,
            ...(d.capacity !== undefined ? { totalCapacity: d.capacity } : {}),
          }),
    }));
    toast.success(am.mode === 'create' ? `Area "${d.name}" created` : 'Area updated');
    setAm({ open: false });
  };

  const deleteArea = (stageId: string, slot: Slot) => {
    if (!window.confirm(`Delete "${slot.name}"?`)) return;
    setStages(p => p.map(s => s.id !== stageId ? s : { ...s, slots: s.slots.filter(sl => sl.id !== slot.id) }));
    toast.success(`Area "${slot.name}" deleted`);
  };

  const saveRow = (d: { name: string; type: string; capacity: number; status: DestStatus }) => {
    if (!rm.open) return;
    setStages(p => p.map(st => st.id !== rm.stageId ? st : {
      ...st,
      slots: st.slots.map(sl => sl.id !== rm.slotId ? sl : {
        ...sl,
        totalCapacity: rm.mode === 'create'
          ? sl.totalCapacity + d.capacity
          : sl.totalCapacity - (rm.dest?.capacity ?? 0) + d.capacity,
        destinations: rm.mode === 'create'
          ? [...sl.destinations, { id: `dest-${Date.now()}`, name: d.name, type: d.type, capacity: d.capacity, occupied: 0, status: d.status }]
          : sl.destinations.map(dt => dt.id !== rm.dest?.id ? dt : { ...dt, name: d.name, type: d.type, capacity: d.capacity, status: d.status }),
      }),
    }));
    toast.success(rm.mode === 'create' ? `Row "${d.name}" created` : 'Row updated');
    setRm({ open: false });
  };

  const toggleStage = (id: string) => setStages(p => p.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  const toggleSlot = (sId: string, slId: string) => setStages(p => p.map(s => s.id !== sId ? s : { ...s, slots: s.slots.map(sl => sl.id === slId ? { ...sl, expanded: !sl.expanded } : sl) }));

  const totalCap = stages.reduce((a, s) => a + s.total, 0);
  const totalOcc = stages.reduce((a, s) => a + s.occupied, 0);
  const totalOff = parkingData.zones.reduce((a, z) => a + z.slots.filter((s: any) => !s.sensorActive).length, 0);
  const zoneOff = (id: string) => { const z = parkingData.zones.find((z: any) => z.id === id); return z ? z.slots.filter((s: any) => !s.sensorActive).length : 0; };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1">Parking Space Control</h1>
            <p className="text-muted-foreground">Manage parking hierarchy: Zones → Areas → Rows</p>
          </div>
          <button
            onClick={() => setZm({ open: true, mode: 'create' })}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
          >
            <Plus className="size-4" /> Create Zone
          </button>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {[
            { icon: <Layers className="size-5 text-chart-1" />, label: 'Total Zones', val: stages.length },
            { icon: <Grid3x3 className="size-5 text-chart-2" />, label: 'Total Areas', val: stages.reduce((a, s) => a + s.slots.length, 0) },
            { icon: <MapPin className="size-5 text-chart-3" />, label: 'Occupied', val: totalOcc },
            { icon: <div className="size-5 bg-muted rounded-full" />, label: 'System Capacity', val: totalCap },
            { icon: <div className="size-5 bg-chart-1 rounded-full" />, label: 'Occupancy Rate', val: `${totalCap > 0 ? Math.round(totalOcc / totalCap * 100) : 0}%` },
            { icon: <WifiOff className="size-5 text-destructive" />, label: 'Offline Sensors', val: totalOff, red: true },
          ].map(({ icon, label, val, red }) => (
            <div key={label} className="p-5 bg-background border border-border rounded-lg">
              <div className="flex items-center gap-3 mb-2">{icon}<span className="text-[13px] text-muted-foreground">{label}</span></div>
              <div className={`text-2xl font-medium ${red ? 'text-destructive' : ''}`}>{val}</div>
            </div>
          ))}
        </div>

        {/* Hierarchy */}
        <div className="space-y-4">
          {stages.map(stage => {
            const occ = stage.occupied;
            const rate = stage.total > 0 ? Math.round(occ / stage.total * 100) : 0;
            return (
              <div key={stage.id} className="bg-background border border-border rounded-lg overflow-hidden">
                {/* Zone row */}
                <div className="p-5 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => toggleStage(stage.id)} className="p-1 hover:bg-muted rounded transition-colors">
                      {stage.expanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                    </button>
                    <div className="p-3 bg-chart-1/10 rounded-lg"><Layers className="size-6 text-chart-1" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{stage.fullName}</h3>
                        <span className="text-[13px] text-muted-foreground">{stage.slots.length} areas</span>
                      </div>
                      <div className="text-[13px] text-muted-foreground">{stage.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[13px] text-muted-foreground mb-1">Capacity</div>
                      <div className="font-medium">{occ} / {stage.total}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] text-muted-foreground mb-1">Occupancy</div>
                      <div className="font-medium">{rate}%</div>
                    </div>
                    <div className="w-32">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-1 transition-all" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] text-muted-foreground mb-1 flex items-center gap-1"><WifiOff className="size-3" />Offline</div>
                      <div className="font-medium text-destructive">{zoneOff(stage.id)}</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setZm({ open: true, mode: 'edit', stage })} className="p-2 hover:bg-background rounded transition-colors" title="Edit Zone">
                        <Edit className="size-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => setAm({ open: true, mode: 'create', stageId: stage.id })} className="p-2 hover:bg-background rounded transition-colors" title="Add Area">
                        <Plus className="size-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => deleteZone(stage)} className="p-2 hover:bg-destructive/10 rounded transition-colors" title="Delete Zone">
                        <Trash2 className="size-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Areas */}
                {stage.expanded && (
                  <div className="divide-y divide-border">
                    {stage.slots.map(slot => {
                      const slOcc = slot.destinations.reduce((a, d) => a + d.occupied, 0);
                      const slRate = slot.totalCapacity > 0 ? Math.round(slOcc / slot.totalCapacity * 100) : 0;
                      return (
                        <div key={slot.id}>
                          <div className="p-4 pl-16 flex items-center justify-between hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                              <button onClick={() => toggleSlot(stage.id, slot.id)} className="p-1 hover:bg-muted rounded transition-colors">
                                {slot.expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                              </button>
                              <div className="p-2 bg-chart-2/10 rounded"><Grid3x3 className="size-5 text-chart-2" /></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-0.5">
                                  <div className="font-medium">{slot.name}</div>
                                  <span className="text-[13px] text-muted-foreground">{slot.destinations.length} rows</span>
                                </div>
                                <div className="text-[13px] text-muted-foreground">{slot.description}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-[13px] text-muted-foreground mb-0.5">Capacity</div>
                                <div className="text-sm font-medium">{slOcc} / {slot.totalCapacity}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[13px] text-muted-foreground mb-0.5">Rate</div>
                                <div className="text-sm font-medium">{slRate}%</div>
                              </div>
                              <div className="w-24">
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-chart-2 transition-all" style={{ width: `${slRate}%` }} />
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => setAm({ open: true, mode: 'edit', stageId: stage.id, slot })} className="p-1.5 hover:bg-muted rounded transition-colors" title="Edit Area">
                                  <Edit className="size-3.5 text-muted-foreground" />
                                </button>
                                <button onClick={() => setRm({ open: true, mode: 'create', stageId: stage.id, slotId: slot.id })} className="p-1.5 hover:bg-muted rounded transition-colors" title="Add Row">
                                  <Plus className="size-3.5 text-muted-foreground" />
                                </button>
                                <button onClick={() => deleteArea(stage.id, slot)} className="p-1.5 hover:bg-destructive/10 rounded transition-colors" title="Delete Area">
                                  <Trash2 className="size-3.5 text-destructive" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Rows */}
                          {slot.expanded && (
                            <div className="pl-24 divide-y divide-border">
                              {slot.destinations.map(dest => {
                                const dr = dest.capacity > 0 ? Math.round(dest.occupied / dest.capacity * 100) : 0;
                                return (
                                  <div key={dest.id} className="p-3 flex items-center justify-between hover:bg-muted/10 transition-colors">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="p-1.5 bg-chart-3/10 rounded"><MapPin className="size-4 text-chart-3" /></div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium">{dest.name}</div>
                                        <span className="text-[11px] px-1.5 py-0.5 bg-muted rounded">{dest.type}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <div className="text-right">
                                        <div className="text-[11px] text-muted-foreground mb-0.5">Occupied</div>
                                        <div className="text-sm font-medium">{dest.occupied} / {dest.capacity}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-[11px] text-muted-foreground mb-0.5">Rate</div>
                                        <div className="text-sm font-medium">{dr}%</div>
                                      </div>
                                      <div className="w-20">
                                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                                          <div className="h-full bg-chart-3 transition-all" style={{ width: `${dr}%` }} />
                                        </div>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusColor(dest.status)}`}>{dest.status}</span>
                                      <button onClick={() => setRm({ open: true, mode: 'edit', stageId: stage.id, slotId: slot.id, dest })} className="p-1 hover:bg-muted rounded transition-colors" title="Edit Row">
                                        <Edit className="size-3 text-muted-foreground" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {zm.open && (
        <ZoneModal
          mode={zm.mode}
          initial={zm.open && zm.mode === 'edit' && zm.stage
            ? {
                id: zm.stage.id,
                fullName: zm.stage.fullName,
                type: zm.stage.type,
                areaCapacities: zm.stage.areaCapacities ?? zm.stage.slots.map(s => s.totalCapacity),
                areaNames: zm.stage.areaNames ?? zm.stage.slots.map(s => s.name),
              }
            : undefined}
          existingIds={stages.map(s => s.id)}
          onSave={saveZone}
          onClose={() => setZm({ open: false })}
        />
      )}
      {am.open && (
        <AreaModal
          mode={am.mode}
          initial={am.open && am.mode === 'edit' && am.slot
            ? { name: am.slot.name, description: am.slot.description, capacity: am.slot.totalCapacity }
            : undefined}
          onSave={saveArea}
          onClose={() => setAm({ open: false })}
        />
      )}
      {rm.open && (
        <RowModal
          mode={rm.mode}
          initial={rm.open && rm.mode === 'edit' && rm.dest ? { name: rm.dest.name, type: rm.dest.type, capacity: rm.dest.capacity, status: rm.dest.status } : undefined}
          onSave={saveRow}
          onClose={() => setRm({ open: false })}
        />
      )}
    </div>
  );
}
