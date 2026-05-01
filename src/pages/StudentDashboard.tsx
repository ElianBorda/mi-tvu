import { toast } from "sonner";
import { commissions, calendarEvents } from "@/data/mockData";
import CommissionDetail from "@/components/CommissionDetail";
import SlidePanel from "@/components/SlidePanel";
import CalendarPanel from "@/components/CalendarPanel";

interface Props {
  showCalendar: boolean;
  onCloseCalendar: () => void;
  unenrolled?: boolean;
}

export default function StudentDashboard({ showCalendar, onCloseCalendar, unenrolled }: Props) {
  const studentCommission = commissions.find(c => c.id === "c1")!;
  const studentEvents = calendarEvents.filter(e => e.commissionId === studentCommission.id);

  if (unenrolled) {
    const handleRecover = () => {
      localStorage.removeItem("studentUnenrolled");
      toast.success("Comisión recuperada (modo testeo).");
      window.location.reload();
    };

    return (
      <div className="relative">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-card border border-border rounded-xl shadow-card px-8 py-12 max-w-lg w-full text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Te diste de baja del taller
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Ya no estás inscripto en ninguna comisión.
            </p>
            <button
              onClick={handleRecover}
              className="mt-6 px-4 py-2 text-xs font-medium rounded-md border border-dashed border-primary/50 text-primary hover:bg-primary/5 transition-colors"
            >
              Recuperar comisión (solo testeo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <CommissionDetail commission={studentCommission} role="student" />
      <SlidePanel open={showCalendar} onClose={onCloseCalendar} title="Calendario académico">
        <CalendarPanel events={studentEvents} onAddEvent={() => {}} />
      </SlidePanel>
    </div>
  );
}
