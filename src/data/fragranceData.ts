export interface FragranceInfo {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  family: string;
  fixation: string;
  projection: string;
  occasion: string;
}

export const fragranceData: Record<string, FragranceInfo> = {
  "212 VIP Black": {
    topNotes: ["Absinto", "Anis", "Erva-doce"],
    heartNotes: ["Lavanda"],
    baseNotes: ["Almíscar", "Casca de Baunilha Negra"],
    family: "Aromático Fougère",
    fixation: "Alta",
    projection: "Marcante",
    occasion: "Noite / Eventos / Inverno"
  }
  // more perfumes will be added here
};
