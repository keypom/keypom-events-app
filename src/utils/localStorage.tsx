import eventHelperInstance from "@/lib/event";

export const get = (key: string) => {
  const value = localStorage.getItem(key);
  if (value !== null) {
    if (!/\{|\[/.test(value?.charAt(0))) {
      return value;
    }
    try {
      return JSON.parse(value);
    } catch (e: any) {
      eventHelperInstance.debugLog(e, "error");
    }
  }
};
export const set = (key: string, value: unknown) => {
  localStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value),
  );
};
export const del = (key: string) => {
  localStorage.removeItem(key);
};
