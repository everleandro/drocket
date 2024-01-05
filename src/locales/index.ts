import { es } from "@/locales/es.json";
import { en } from "@/locales/en.json";
import { fr } from "@/locales/fr.json";

export type suportedLng = "es" | "en" | "fr";

export interface Locale {
  months: Array<string>;
  monthsShort: Array<string>;
  weekdays: Array<string>;
  weekdaysShort: Array<string>;
  weekdaysMin: Array<string>;
  start: number;
}

export class Lng {
  selectedLng: suportedLng;
  start!: number;

  lngAvailableObject: Record<suportedLng, Locale> = { es, en, fr };

  constructor(lng: suportedLng = "en", start: number | undefined = undefined) {
    this.selectedLng = lng;
    this.start =
      start !== undefined
        ? start
        : this.lngAvailableObject[this.selectedLng].start;
  }

  get weekdaysMin(): Array<string> {
    return this.sliceLangList(this.currentLng.weekdaysMin, this.start);
  }

  get currentLng(): Locale {
    return this.lngAvailableObject[this.selectedLng];
  }

  get months(): Array<string> {
    return this.currentLng.months;
  }

  get monthsShort(): Array<string> {
    return this.currentLng.monthsShort;
  }

  get weekdays(): Array<string> {
    return this.sliceLangList(this.currentLng.weekdays, this.start);
  }

  get weekdaysShort(): Array<string> {
    return this.sliceLangList(this.currentLng.weekdaysShort, this.start);
  }

  sliceLangList(list: Array<string>, start: number): Array<string> {
    const end = list.length;
    const firstList = list.slice(0, start);
    const secondList = list.slice(start, list.length);
    return [...secondList, ...firstList];
  }
}
