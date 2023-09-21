import { create } from "zustand";
import { scorm } from "@gamestdio/scorm";

const pages = ["/", "/home", "/end"] as const;

type Page = (typeof pages)[number];

type Scorm = {
  init: () => void;
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => void;
  updateProgress: (page: Page) => void;
  exit: () => void;
};

export const useScorm = create<Scorm>(() => {
  function set(key: string, value: any) {
    scorm.set(key, JSON.stringify(value));
  }

  function get(key: string, defaultValue?: any) {
    try {
      return JSON.parse(scorm.get(key)) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }

  return {
    init() {
      scorm.configure({ debug: true });
      scorm.initialize();
      set("cmi.core.score.min", 0);
      set("cmi.core.score.max", 1);
      const currentProgress = get("cmi.core.score.raw", 0);
      if (currentProgress < 1) {
        set("cmi.core.lesson_status", "incomplete");
        set("cmi.objectives.n.status", "incomplete");
      }
    },
    get,
    set,
    updateProgress(page) {
      const currentProgress = get("cmi.core.score.raw", 0);
      const progress = (pages.indexOf(page) + 1) / Math.max(1, pages.length);
      set("cmi.core.score.raw", Math.max(currentProgress, progress));
      if (progress === 1) {
        set("cmi.core.lesson_status", "completed");
        set("cmi.objectives.n.status", "completed");
      }
    },
    exit() {
      set("cmi.core.exit", "logout");
      window.close();
    },
  };
});
