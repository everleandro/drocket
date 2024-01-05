import { Lng, suportedLng } from "../locales/index";
export default class UtilDate {
  date;
  lng: Lng;

  constructor(
    date: string | number | Date = new Date(),
    lng: suportedLng = "en"
  ) {
    this.date = new Date(date);
    this.lng = new Lng(lng);
  }

  private addHours(h: number | string): UtilDate {
    return new UtilDate(
      this.date.setHours(this.date.getHours() + parseInt(`${h}`))
    );
  }

  private setHours(h: number | string): UtilDate {
    return new UtilDate(this.date.setHours(parseInt(`${h}`)));
  }

  private addMinutes(minutes: number | string): UtilDate {
    return new UtilDate(
      this.date.setMinutes(this.date.getMinutes() + parseInt(`${minutes}`))
    );
  }

  private setMinutes(minutes: number | string): UtilDate {
    return new UtilDate(this.date.setMinutes(parseInt(`${minutes}`)));
  }

  private addSeconds(seconds: number | string): UtilDate {
    return new UtilDate(
      this.date.setSeconds(this.date.getSeconds() + parseInt(`${seconds}`))
    );
  }

  private setSeconds(seconds: number | string): UtilDate {
    return new UtilDate(this.date.setSeconds(parseInt(`${seconds}`)));
  }

  private setMonth(month: number | string): UtilDate {
    return new UtilDate(this.date.setMonth(parseInt(`${month}`)));
  }

  private addMonths(month: number | string): UtilDate {
    return new UtilDate(
      this.date.setMonth(this.date.getMonth() + parseInt(`${month}`))
    );
  }

  private addDays(days: number | string): UtilDate {
    return new UtilDate(
      this.date.setDate(this.date.getDate() + parseInt(`${days}`))
    );
  }

  private setDays(days: number | string): UtilDate {
    return new UtilDate(this.date.setDate(parseInt(`${days}`)));
  }

  private setYears(year: number | string): UtilDate {
    return new UtilDate(this.date.setFullYear(parseInt(`${year}`)));
  }

  private addYears(years: number | string): UtilDate {
    return new UtilDate(
      this.date.setFullYear(this.date.getFullYear() + parseInt(`${years}`))
    );
  }

  setTime(hours = 0, minutes = 0, seconds = 0): UtilDate {
    return this.setHours(hours).setMinutes(minutes).setSeconds(seconds);
  }
  setLng(lng: suportedLng) {
    this.lng = new Lng(lng);
    return new UtilDate(this.date, lng);
  }

  startOfMonth(): UtilDate {
    return new UtilDate(this.date).set(1, "days");
  }

  endOfMonth(): UtilDate {
    const newDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    );
    return new UtilDate(newDate);
  }

  startOfYear(): UtilDate {
    return new UtilDate(this.date, this.lng.selectedLng).set(1, "months");
  }

  add(
    amount: number | string,
    key: "seconds" | "minutes" | "hours" | "days" | "months" | "years"
  ): UtilDate {
    switch (key) {
      case "seconds":
        return this.addSeconds(amount);
      case "minutes":
        return this.addMinutes(amount);
      case "hours":
        return this.addHours(amount);
      case "days":
        return this.addDays(amount);
      case "months":
        return this.addMonths(amount);
      case "years":
        return this.addYears(amount);
      default:
        return this;
    }
  }

  subtract(
    amount: number | string,
    key: "seconds" | "minutes" | "hours" | "days" | "months" | "years"
  ): UtilDate {
    const value = parseInt(`${amount}`, 10);
    const negativeAmount = value >= 0 ? value * -1 : value;
    switch (key) {
      case "seconds":
        return this.addSeconds(negativeAmount);
      case "minutes":
        return this.addMinutes(negativeAmount);
      case "hours":
        return this.addHours(negativeAmount);
      case "days":
        return this.addDays(negativeAmount);
      case "months":
        return this.addMonths(negativeAmount);
      case "years":
        return this.addYears(negativeAmount);
      default:
        return this;
    }
  }

  set(
    amount: number | string,
    key: "seconds" | "minutes" | "hours" | "days" | "months" | "years"
  ): UtilDate {
    let result;
    switch (key) {
      case "seconds":
        result = this.setSeconds(amount);
        break;
      case "minutes":
        result = this.setMinutes(amount);
        break;
      case "hours":
        result = this.setHours(amount);
        break;
      case "days":
        result = this.setDays(amount);
        break;
      case "months":
        result = this.setMonth(amount);
        break;
      case "years":
        result = this.setYears(amount);
        break;
      default:
        result = this;
        break;
    }
    return result.setLng(this.lng.selectedLng);
  }

  isValidDate(date: Date): boolean {
    if (Object.prototype.toString.call(date) !== "[object Date]") {
      return false;
    }
    return !isNaN(date.getTime());
  }

  get weekdayName(): string {
    return this.lng.currentLng.weekdays[this.date.getDay()];
  }

  get weekdayShortName(): string {
    return this.lng.currentLng.weekdaysShort[this.date.getDay()];
  }

  get weekdaysMinName(): string {
    return this.lng.currentLng.weekdaysMin[this.date.getDay()];
  }

  get monthName(): string {
    return this.lng.currentLng.months[this.date.getMonth()];
  }

  get monthshortName(): string {
    return this.lng.currentLng.monthsShort[this.date.getMonth()];
  }

  get daysInMonth() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }

  get nthSuffix(): string {
    switch (this.date.getDate()) {
      case 1:
      case 21:
      case 31:
        return "st";
      case 2:
      case 22:
        return "nd";
      case 3:
      case 23:
        return "rd";
      default:
        return "th";
    }
  }

  format(format: string) {
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const hours = this.date.getHours();
    const minutes = this.date.getMinutes();

    return format
      .replace(/week-dddd/, this.weekdayName)
      .replace(/week-ddd/, this.weekdayShortName)
      .replace(/week-dd/, this.weekdaysMinName)
      .replace(/month-DD/, ("0" + day).slice(-2))
      .replace(/month-D/, `${day}`)
      .replace(/hour-hh/, ("0" + hours).slice(-2))
      .replace(/hour-h/, `${hours}`)
      .replace(/minutes-mm/, ("0" + minutes).slice(-2))
      .replace(/minutes-m/, `${minutes}`)
      .replace(/year-YYYY/, `${year}`)
      .replace(/year-YY/, String(year).slice(2))
      .replace(/month-mmmm/, this.monthName)
      .replace(/month-mmm/, this.monthshortName)
      .replace(/month-MM/, ("0" + month).slice(-2))
      .replace(/month-M/, `${month}`)
      .replace(/nth-su/, this.nthSuffix);
  }

  createDateArray(start: Date | string, end: Date | string): Array<Date> {
    const dates = [];
    let localStart = new Date(start);
    const localEnd = new Date(end);
    while (localStart <= localEnd) {
      dates.push(new Date(start));
      localStart = new Date(
        new Date(start).setDate(new Date(start).getDate() + 1)
      );
    }
    return dates;
  }
}
