import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { PetSearchDirectory } from "./components/PetSearchDirectory";
import { PetMatchQuestionnaire } from "./components/PetMatchQuestionnaire";
import { HappyTailsStories } from "./components/HappyTailsStories";
import "./styles.css";

function App() {
  useEffect(() => {
    const menuButton = document.querySelector<HTMLButtonElement>(".menu-btn");
    const navigation = document.getElementById("main-navigation");
    const closeMenu = () => {
      navigation?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open menu");
      if (menuButton) menuButton.textContent = "☰";
    };
    const toggleMenu = () => {
      const isOpen = navigation?.classList.toggle("is-open") ?? false;
      menuButton?.setAttribute("aria-expanded", String(isOpen));
      menuButton?.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu",
      );
      if (menuButton) menuButton.textContent = isOpen ? "×" : "☰";
    };
    menuButton?.addEventListener("click", toggleMenu);
    navigation?.addEventListener("click", closeMenu);

    const panelIds = ["discover", "how", "stories"];
    const listeners = panelIds.map((panelId) => {
      const link = document.querySelector<HTMLAnchorElement>(
        `.main-nav a[href="#${panelId}"]`,
      );
      if (!link) return null;

      const focusPanel = (event?: MouseEvent) => {
        event?.preventDefault();
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const hash = `#${panelId}`;
        if (window.location.hash !== hash)
          window.history.pushState(null, "", hash);
        panel.scrollIntoView({ behavior: "smooth", block: "center" });
        panel.classList.remove("is-highlighted");
        window.requestAnimationFrame(() => {
          panel.classList.add("is-highlighted");
          window.setTimeout(
            () => panel.classList.remove("is-highlighted"),
            1800,
          );
        });
      };

      link.addEventListener("click", focusPanel);
      return { link, focusPanel, panelId };
    });

    const currentPanel = window.location.hash.slice(1);
    const currentLink = listeners.find(
      (item) => item?.panelId === currentPanel,
    );
    if (currentLink)
      window.requestAnimationFrame(() => currentLink.focusPanel());

    return () => {
      menuButton?.removeEventListener("click", toggleMenu);
      navigation?.removeEventListener("click", closeMenu);
      listeners.forEach((item) =>
        item?.link.removeEventListener("click", item.focusPanel),
      );
    };
  }, []);

  return (
    <>
      <PetSearchDirectory />
      <PetMatchQuestionnaire />
      <HappyTailsStories />
    </>
  );
}

createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
