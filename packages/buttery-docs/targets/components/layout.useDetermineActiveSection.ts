import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook to determine and set the active section based on the current pathname.
 * It uses IntersectionObserver to track which heading is currently in view and updates
 * the corresponding anchor link to an active state.
 *
 * @param {string} pathname - The current pathname of the application.
 * @returns {void}
 */
export const useDetermineActiveSection = (pathname: string) => {
  const headingsRef = useRef<NodeListOf<HTMLHeadingElement> | null>(null);
  const anchorsRef = useRef<NodeListOf<HTMLAnchorElement> | null>(null);

  const getHeadings = useCallback(() => {
    if (!headingsRef.current) {
      headingsRef.current =
        document.querySelectorAll<HTMLHeadingElement>(".heading");
    }
    return headingsRef.current;
  }, []);

  const getAnchors = useCallback(() => {
    if (!anchorsRef.current) {
      anchorsRef.current =
        document.querySelectorAll<HTMLAnchorElement>(".contents-link");
    }
    return anchorsRef.current;
  }, []);

  // doing this because I think prop drilling and the stateful way of doing this
  // is going to a be a bit too much
  const setActiveAnchor = useCallback<(activeHash: string) => void>(
    (activeHash) => {
      const anchors = getAnchors();
      // biome-ignore lint/complexity/noForEach: Using a native iterator on the prototype
      anchors.forEach((anchor) => {
        const anchorHash = anchor.hash;

        if (anchorHash === activeHash && !anchor.classList.contains("active")) {
          anchor.classList.add("active");
        }

        if (anchorHash !== activeHash) {
          anchor.classList.remove("active");
        }
      });
    },
    [getAnchors]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want this to change anytime the page is changed
  useEffect(() => {
    if (typeof window === "undefined") return;

    const headings = getHeadings();

    const iObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target.nodeName === "H1") return;
          const entryHash = `#${entry.target.id}`;

          // TODO: This logic can be improved
          console.log(
            entry.target.id,
            entry.isIntersecting,
            entry.boundingClientRect.top > 65
          );
          if (
            entry.isIntersecting &&
            entry.boundingClientRect.top > 65 &&
            entry.boundingClientRect.top < 500
          ) {
            setActiveAnchor(entryHash);
          }

          // when we leave the page - 65
          if (
            !entry.isIntersecting &&
            entry.boundingClientRect.top > 0 &&
            entry.boundingClientRect.top < 65
          ) {
            setActiveAnchor(entryHash);
          }
        }
      },
      {
        root: null,
        rootMargin: "-65px",
        threshold: [0.99],
      }
    );
    // biome-ignore lint/complexity/noForEach: Using a native prototype iterator
    headings.forEach((heading) => iObserver.observe(heading));

    return () => {
      // biome-ignore lint/complexity/noForEach: Using a native forEach
      headings.forEach((heading) => iObserver.unobserve(heading));
    };
  }, [pathname]);
};
