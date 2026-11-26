"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

/** One friendly line for developers who open DevTools. Logged once per page load; renders nothing. */
export function ConsoleHello() {
  useEffect(() => {
    console.log(
      `%cHi, I'm ${site.name}.%c\nLooking under the hood? Press X on any case study for the engineering layer. Say hello: ${site.email} · ${site.links.github}`,
      "font:800 16px system-ui;color:#8b7bff",
      "font:12px system-ui;color:#8b8a99",
    );
  }, []);
  return null;
}
