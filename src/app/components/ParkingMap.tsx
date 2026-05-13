import { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, WifiOff, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ParkingMapProps {
  parkingData: any;
}

export function ParkingMap({ parkingData }: ParkingMapProps) {
  const [selectedZoneId, setSelectedZoneId] = useState(parkingData.zones[0]?.id);
  // Derive selectedZone trực tiếp từ parkingData để luôn có data mới nhất
  const selectedZone = parkingData.zones.find((z: any) => z.id === selectedZoneId) ?? parkingData.zones[0];
  
  const handleResetSlots = () => {
    toast.success('Đã reset lại tất cả các slot về trạng thái sẵn sàng');
  };

  const getSlotStatus = (slot: any) => {
    if (!slot.sensorActive) return 'offline';
    if (slot.occupied) return 'occupied';
    if (slot.reserved) return 'reserved';
    return 'available';
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-destructive';
      case 'reserved':
        return 'bg-chart-4';
      case 'available':
        return 'bg-chart-2';
      case 'offline':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  const getZoneLayout = (zoneId: string) => {
    // Định nghĩa layout khác nhau cho mỗi zone
    const layouts: any = {
      'A': { areas: 2, rowsPerArea: 3, slotsPerRow: 10 }, // Area A, B
      'B': { areas: 3, rowsPerArea: 2, slotsPerRow: 10 }, // Area A, B, C
      'C': { areas: 2, rowsPerArea: 4, slotsPerRow: 8 }, // Area A, B
      'D': { areas: 3, rowsPerArea: 2, slotsPerRow: 9 }, // Area A, B, C
      'E': { areas: 2, rowsPerArea: 3, slotsPerRow: 10 }, // Area A, B
    };
    return layouts[zoneId] || layouts['A'];
  };

  const getAreaLabel = (areaIndex: number) => {
    return String.fromCharCode(65 + areaIndex); // A, B, C, D, ...
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-1">Parking Map</h1>
          <p className="text-muted-foreground">Visual layout and real-time slot status</p>
        </div>

        <div className="flex gap-6">
          {/* Zone Selector */}
          <div className="w-64 shrink-0">
            <div className="bg-background border border-border rounded-lg p-4 mb-4">
              <div className="text-[13px] font-medium mb-3 text-muted-foreground">SELECT ZONE</div>
              <div className="space-y-2">
                {parkingData.zones.map((zone: any) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedZone.id === zone.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium mb-1">{zone.fullName}</div>
                    <div className="text-[13px] opacity-80">
                      {zone.total - zone.occupied} / {zone.total} available
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="text-[13px] font-medium mb-3 text-muted-foreground">LEGEND</div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="size-4 bg-chart-2 rounded"></div>
                  <span className="text-[13px]">Available</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-4 bg-destructive rounded"></div>
                  <span className="text-[13px]">Occupied</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-4 bg-chart-4 rounded"></div>
                  <span className="text-[13px]">Reserved</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="size-4 bg-muted rounded"></div>
                  <span className="text-[13px]">Sensor Offline</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Grid */}
          <div className="flex-1 bg-background border border-border rounded-lg p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mb-1">{selectedZone.fullName}</h2>
                <p className="text-[13px] text-muted-foreground">
                  {selectedZone.occupied} occupied • {selectedZone.total - selectedZone.occupied} available • {selectedZone.total} total
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[13px] text-muted-foreground mb-1">Last updated</div>
                  <div className="text-sm">{selectedZone.lastUpdate}</div>
                </div>
                <button
                  onClick={handleResetSlots}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  title="Reset all slots to available state"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Parking Grid - Realistic Lot Layout */}
            <div className="space-y-8 overflow-x-auto">
              {(() => {
                const layout = getZoneLayout(selectedZone.id);
                const slotsPerArea = Math.floor(selectedZone.slots.length / layout.areas);
                const slotsPerRow = Math.floor(slotsPerArea / layout.rowsPerArea / 2);
                const actualSlotsPerArea = layout.rowsPerArea * (slotsPerRow * 2);
                
                const areas = [];
                for (let areaIdx = 0; areaIdx < layout.areas; areaIdx++) {
                  areas.push(areaIdx);
                }
                return areas.map((areaIdx) => (
                  <div key={`area-${areaIdx}`}>
                    <div className="mb-3 text-sm font-bold text-muted-foreground">AREA {getAreaLabel(areaIdx)}</div>
                    <div className="space-y-4">
                      {Array.from({ length: layout.rowsPerArea }).map((_, rowIdx) => {
                        const areaStart = areaIdx * actualSlotsPerArea;
                        const rowStart = areaStart + (rowIdx * slotsPerRow * 2);
                        const leftSlots = selectedZone.slots.slice(rowStart, rowStart + slotsPerRow);
                        const rightSlots = selectedZone.slots.slice(rowStart + slotsPerRow, rowStart + slotsPerRow * 2);
                        
                        return (
                          <div key={`row-${areaIdx}-${rowIdx}`} className="flex gap-3 items-start">
                            {/* Left Side */}
                            <div className="flex flex-col gap-1">
                              <div className="flex gap-1">
                                {leftSlots.map((slot: any) => {
                                  const status = getSlotStatus(slot);
                                  const colorClass = getSlotColor(status);
                                  return (
                                    <div
                                      key={slot.id}
                                      className={`relative w-8 h-12 ${colorClass} rounded transition-all hover:scale-110 cursor-pointer group`}
                                      title={`Slot ${slot.number} - ${status}`}
                                    >
                                      <div className="absolute inset-0 flex items-center justify-center text-white">
                                        <div className="text-[10px] font-medium opacity-90">{slot.number}</div>
                                      </div>
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-popover border border-border rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {slot.number}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Aisle (Road) */}
                            <div className="w-10 h-6 bg-muted rounded border border-dashed border-muted-foreground/30 flex items-center justify-center text-[10px] text-muted-foreground font-semibold">
                              ↔
                            </div>

                            {/* Right Side */}
                            <div className="flex flex-col gap-1">
                              <div className="flex gap-1 flex-row-reverse">
                                {rightSlots.map((slot: any) => {
                                  const status = getSlotStatus(slot);
                                  const colorClass = getSlotColor(status);
                                  return (
                                    <div
                                      key={slot.id}
                                      className={`relative w-8 h-12 ${colorClass} rounded transition-all hover:scale-110 cursor-pointer group`}
                                      title={`Slot ${slot.number} - ${status}`}
                                    >
                                      <div className="absolute inset-0 flex items-center justify-center text-white">
                                        <div className="text-[10px] font-medium opacity-90">{slot.number}</div>
                                      </div>
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-popover border border-border rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {slot.number}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Zone Info */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-medium mb-1">{selectedZone.slots.filter((s: any) => getSlotStatus(s) === 'available').length}</div>
                  <div className="text-[13px] text-muted-foreground">Available</div>
                </div>
                <div>
                  <div className="text-2xl font-medium mb-1">{selectedZone.slots.filter((s: any) => getSlotStatus(s) === 'occupied').length}</div>
                  <div className="text-[13px] text-muted-foreground">Occupied</div>
                </div>
                <div>
                  <div className="text-2xl font-medium mb-1">{selectedZone.slots.filter((s: any) => s.reserved).length}</div>
                  <div className="text-[13px] text-muted-foreground">Reserved</div>
                </div>
                <div>
                  <div className="text-2xl font-medium mb-1">{selectedZone.slots.filter((s: any) => !s.sensorActive).length}</div>
                  <div className="text-[13px] text-muted-foreground">Offline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
