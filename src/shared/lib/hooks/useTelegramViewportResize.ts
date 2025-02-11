import { useCallback, useEffect, useState } from "react";

export const useTelegramViewportHack = () => {
    useEffect(() => {
        const preventScroll = (e: Event) => {
          if (e instanceof WheelEvent || e instanceof TouchEvent) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
    
        const onFocusIn = (e: FocusEvent) => {
          const target = e.target as HTMLElement;
          if (
            target &&
            (target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.tagName === "SELECT")
          ) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
            window.addEventListener("wheel", preventScroll, { passive: false });
            window.addEventListener("touchmove", preventScroll, { passive: false });
          }
        };
    
        const onFocusOut = (e: FocusEvent) => {
          const target = e.target as HTMLElement;
          if (
            target &&
            (target.tagName === "INPUT" ||
              target.tagName === "TEXTAREA" ||
              target.tagName === "SELECT")
          ) {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            window.removeEventListener("wheel", preventScroll);
            window.removeEventListener("touchmove", preventScroll);
          }
        };
    
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);
    
        return () => {
          document.removeEventListener("focusin", onFocusIn);
          document.removeEventListener("focusout", onFocusOut);
          window.removeEventListener("wheel", preventScroll);
          window.removeEventListener("touchmove", preventScroll);
        };
      }, []);
};
