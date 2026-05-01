import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { CalendarEvent } from "@/data/types";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  events: CalendarEvent[];
  onAddEvent?: () => void;
}

const STORAGE_KEY = "customCalendarEvents";

export default function CalendarPanel({ events: initialEvents, onAddEvent }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [extraEvents, setExtraEvents] = useState<CalendarEvent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
    } catch {
      return [];
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(extraEvents));
    } catch {
      /* ignore */
    }
  }, [extraEvents]);

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
    setEventDate(selectedDate ?? undefined);
    setEventName("");
    setEventDescription("");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!eventDate || !eventName.trim() || !eventDescription.trim()) {
      toast.error("Completá todos los campos.");
      return;
    }
    const newEvent: CalendarEvent = {
      date: format(eventDate, "yyyy-MM-dd"),
      commissionId: `custom-${Date.now()}`,
      commissionName: eventName.trim(),
      name: eventName.trim(),
      description: eventDescription.trim(),
    };
    setExtraEvents(prev => [...prev, newEvent]);
    setDialogOpen(false);
    toast.success("Evento agregado al calendario.");
    setSelectedDate(eventDate);
    setCurrentMonth(eventDate);
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
              onClick={() => setSelectedDate(day)}
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
              <p className="text-xs font-medium text-foreground">{e.name ?? e.commissionName}</p>
              {e.description ? (
                <p className="text-[10px] text-muted-foreground whitespace-pre-wrap">{e.description}</p>
              ) : (
                <p className="text-[10px] text-muted-foreground">{e.schedule} · {e.classroom}</p>
              )}
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
            <div className="space-y-1.5 flex flex-col">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-10 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-left",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon size={16} className="opacity-60" />
                    {eventDate ? format(eventDate, "PPP", { locale: es }) : <span>Seleccioná una fecha</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                    locale={es}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-name">Nombre del evento</Label>
              <Input id="ev-name" placeholder="Ej: Entrega de TP final" value={eventName} onChange={e => setEventName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ev-desc">Descripción</Label>
              <Textarea id="ev-desc" placeholder="Detalles del evento..." rows={4} value={eventDescription} onChange={e => setEventDescription(e.target.value)} />
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
