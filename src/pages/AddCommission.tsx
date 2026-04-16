import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { commissions } from "@/data/mockData";

export default function AddCommission() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    localidad: "",
    departamento: "",
    carrera: "",
    aula: "",
    horaInicioH: "",
    horaInicioM: "",
    horaFinH: "",
    horaFinM: "",
  });

  // Prefill form when in edit mode
  useEffect(() => {
    if (!isEdit) return;
    const commission = commissions.find(c => c.id === id);
    if (!commission) {
      toast.error("La comisión no existe.");
      navigate("/?view=commissions");
      return;
    }
    // Parse schedule "Lunes y Miércoles · 19:00–21:00" -> times
    const timeMatch = commission.schedule.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    setForm({
      localidad: commission.locality ?? "",
      departamento: commission.department ?? "",
      carrera: commission.career ?? "",
      aula: commission.classroom?.replace(/^Aula\s*/i, "") ?? "",
      horaInicioH: timeMatch?.[1] ?? "",
      horaInicioM: timeMatch?.[2] ?? "",
      horaFinH: timeMatch?.[3] ?? "",
      horaFinM: timeMatch?.[4] ?? "",
    });
  }, [id, isEdit, navigate]);

  const handleChange = (field: string, value: string) => {
    if (["horaInicioH", "horaFinH"].includes(field)) {
      const num = value.replace(/\D/g, "").slice(0, 2);
      if (num && Number(num) > 23) return;
      setForm(prev => ({ ...prev, [field]: num }));
      return;
    }
    if (["horaInicioM", "horaFinM"].includes(field)) {
      const num = value.replace(/\D/g, "").slice(0, 2);
      if (num && Number(num) > 59) return;
      setForm(prev => ({ ...prev, [field]: num }));
      return;
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.localidad.trim() ||
      !form.departamento.trim() ||
      !form.carrera.trim() ||
      !form.aula.trim() ||
      !form.horaInicioH ||
      !form.horaInicioM ||
      !form.horaFinH ||
      !form.horaFinM
    ) {
      toast.error("Por favor completá todos los campos obligatorios.");
      return;
    }

    const horarioInicio = `${form.horaInicioH.padStart(2, "0")}:${form.horaInicioM.padStart(2, "0")}`;
    const horarioFin = `${form.horaFinH.padStart(2, "0")}:${form.horaFinM.padStart(2, "0")}`;

    // Mock: log the body
    console.log({
      ...(isEdit && { id }),
      localidad: form.localidad,
      departamento: form.departamento,
      carrera: form.carrera,
      aula: form.aula,
      horarioInicio,
      horarioFin,
    });

    toast.success(isEdit ? "Comisión actualizada exitosamente." : "Comisión creada exitosamente.");
    navigate("/?view=commissions");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <button
          onClick={() => navigate("/?view=commissions")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </button>

        <div className="bg-card rounded-xl shadow-card border border-border p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
            {isEdit ? "Modificar comisión" : "Agregar comisión"}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            {isEdit
              ? "Actualizá los datos de la comisión seleccionada."
              : "Completá los datos de la nueva comisión para darla de alta en el sistema."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="localidad">Localidad *</Label>
                <Input
                  id="localidad"
                  placeholder="Ej: Resistencia"
                  value={form.localidad}
                  onChange={e => handleChange("localidad", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento *</Label>
                <Input
                  id="departamento"
                  placeholder="Ej: San Fernando"
                  value={form.departamento}
                  onChange={e => handleChange("departamento", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="carrera">Carrera *</Label>
                <Input
                  id="carrera"
                  placeholder="Ej: Lic. en Informática"
                  value={form.carrera}
                  onChange={e => handleChange("carrera", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aula">Aula *</Label>
                <Input
                  id="aula"
                  placeholder="Ej: Aula 3B"
                  value={form.aula}
                  onChange={e => handleChange("aula", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Horario de inicio *</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="w-20 text-center"
                  placeholder="HH"
                  value={form.horaInicioH}
                  onChange={e => handleChange("horaInicioH", e.target.value)}
                  maxLength={2}
                />
                <span className="text-muted-foreground font-medium">:</span>
                <Input
                  className="w-20 text-center"
                  placeholder="MM"
                  value={form.horaInicioM}
                  onChange={e => handleChange("horaInicioM", e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Horario de fin *</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="w-20 text-center"
                  placeholder="HH"
                  value={form.horaFinH}
                  onChange={e => handleChange("horaFinH", e.target.value)}
                  maxLength={2}
                />
                <span className="text-muted-foreground font-medium">:</span>
                <Input
                  className="w-20 text-center"
                  placeholder="MM"
                  value={form.horaFinM}
                  onChange={e => handleChange("horaFinM", e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {isEdit ? "Guardar cambios" : "Confirmar y crear comisión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
