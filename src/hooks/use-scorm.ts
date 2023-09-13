import { create } from "zustand";
import { scorm } from "@gamestdio/scorm";

const pages = ["/", "/home", "/end"] as const;

type Page = (typeof pages)[number];

type Scorm = {
  init: () => void;
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => void;
  updateProgress: (page: Page) => void;
};

export const useScorm = create<Scorm>(() => {
  return {
    init() {
      scorm.configure({ debug: true });
      scorm.initialize();
      this.set("cmi.core.score.min", 0);
      this.set("cmi.core.score.max", 1);
      this.set("cmi.success_status", "unknown");
      this.set("cmi.completion_status", "incomplete");
    },
    get(key, defaultValue = null) {
      try {
        return JSON.parse(scorm.get(key)) ?? defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set(key, value) {
      scorm.set(key, JSON.stringify(value));
    },
    updateProgress(page) {
      const currentProgress = this.get("cmi.core.score.raw", 0);
      const progress = (pages.indexOf(page) + 1) / Math.max(1, pages.length);
      this.set("cmi.core.score.raw", Math.max(currentProgress, progress));
      if (progress === 1) {
        this.set("cmi.core.lesson_status", "passed");
        this.set("cmi.success_status", "passed");
        this.set("cmi.completion_status", "completed");
      }
    },
  };
});
