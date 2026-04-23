export enum UnenrollReason {
  FALTA_DE_TIEMPO = "Falta de tiempo",
  CAMBIO_INSTITUCION = "Cambio de institución",
  MOTIVOS_PERSONALES = "Motivos personales",
  PROBLEMAS_CURSADAS = "Problemas con la cursada",
  DISTANCIA_GEOGRAFICA = "Distancia geografica",
  FALTA_INFORMACION = "Falta de información",
  DESACUERDO_BUROCRACIA = "Desacuerdo con la burocracia",
  OTRO = "Otro",
}

export const UNENROLL_REASONS: { key: keyof typeof UnenrollReason; label: string }[] = [
  { key: "FALTA_DE_TIEMPO", label: UnenrollReason.FALTA_DE_TIEMPO },
  { key: "CAMBIO_INSTITUCION", label: UnenrollReason.CAMBIO_INSTITUCION },
  { key: "MOTIVOS_PERSONALES", label: UnenrollReason.MOTIVOS_PERSONALES },
  { key: "PROBLEMAS_CURSADAS", label: UnenrollReason.PROBLEMAS_CURSADAS },
  { key: "DISTANCIA_GEOGRAFICA", label: UnenrollReason.DISTANCIA_GEOGRAFICA },
  { key: "FALTA_INFORMACION", label: UnenrollReason.FALTA_INFORMACION },
  { key: "DESACUERDO_BUROCRACIA", label: UnenrollReason.DESACUERDO_BUROCRACIA },
  { key: "OTRO", label: UnenrollReason.OTRO },
];
