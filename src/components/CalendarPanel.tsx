import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent } from "@/data/types";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  events: CalendarEvent[];
  onAddEvent?: () => void;
}

export default function CalendarPanel({ events: initialEvents, onAddEvent }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [extraEvents, setExtraEvents] = useState<CalendarEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    commissionName: "",
    startTime: "",
    endTime: "",
    classroom: "",
  });

  const events = useMemo(() => [...initialEvents, ...extraEvents], [initialEvents, extraEvents]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const d: Date[] = [];
    let day = start;
    while (day <= end) {
      d.push(day);
      day = addDays(day, 1);
    }
    return d;
  }, [currentMonth]);

  const eventsForDate = (date: Date) =>
    events.filter(e => isSameDay(new Date(e.date), date));

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  const openDialog = () => {
    if (onAddEvent) onAddEvent();
    setForm({
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
      commissionName: "",
      startTime: "",
      endTime: "",
      classroom: "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.date || !form.commissionName || !form.startTime || !form.endTime || !form.classroom) {
      toast.error("Completá todos los campos.");
      return;
    }
    const newEvent: CalendarEvent = {
      date: form.date,
      commissionId: `custom-${Date.now()}`,
      commissionName: form.commissionName,
      schedule: `${form.startTime}–${form.endTime}`,
      classroom: form.classroom,
    };
    setExtraEvents(prev => [...prev, newEvent]);
    setDialogOpen(false);
    toast.success("Evento agregado al calendario.");
    setSelectedDate(new Date(form.date));
    setCurrentMonth(new Date(form.date));
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-5">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-secondary rounded">
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-sm font-semibold text-foreground capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-secondary rounded">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, i) => {
          const hasEvents = eventsForDate(day).length > 0;
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const inMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={i}
              onClick={() => hasEvents ? setSelectedDate(day) : setSelectedDate(day)}
              className={`relative h-9 text-xs font-medium rounded transition-colors
                ${inMonth ? "text-foreground" : "text-muted-foreground/40"}
                ${isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-secondary" : "hover:bg-secondary"}
              `}
            >
              {format(day, "d")}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date events */}
      {selectedEvents.length > 0 && selectedDate && (
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <p className="text-xs font-semibold text-foreground mb-2">
            {format(selectedDate, "d 'de' MMMM", { locale: es })}
          </p>
          {selectedEvents.map((e, i) => (
            <div key={i} className="bg-secondary rounded-md px-3 py-2">
              <p className="text-xs font-medium text-foreground">{e.commissionName}</p>
              <p className="text-[10px] text-muted-foreground">{e.schedule} · {e.classroom}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={openDialog}
        className="mt-4 w-full py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
      >
        + Agregar evento
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ev-date">Fecha</Label>
              <Input id="ev-date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-name">Nombre / Comisión</Label>
              <Input id="ev-name" placeholder="Ej: Comisión 3" value={form.commissionName} onChange={e => setForm({ ...form, commissionName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ev-start">Hora inicio</Label>
                <Input id="ev-start" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-end">Hora fin</Label>
                <Input id="ev-end" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-class">Aula</Label>
              <Input id="ev-class" placeholder="Ej: Aula 45" value={form.classroom} onChange={e => setForm({ ...form, classroom: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Guardar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
