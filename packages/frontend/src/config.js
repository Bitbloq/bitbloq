import dynamic from "next/dynamic";

import { colors, Icon } from "@bitbloq/ui";

import { addShapeGroups } from "./configurations/3d/addShapeGroups";
import { bloqTypes } from "./configurations/bloqs/bloqTypes";
import { boards } from "./configurations/hardware/boards";
import { components } from "./configurations/hardware/components";

export { addShapeGroups, bloqTypes, boards, components };

const ThreeDEditor = dynamic(() => import("./components/ThreeDEditor"), {
  ssr: false
});

const JuniorEditor = dynamic(() => import("./components/JuniorEditor"), {
  ssr: false
});

const ENABLED_TOOLS = process.env.ENABLED_TOOLS || [];

export const documentTypes = {
  junior: {
    label: "Robótica Junior",
    shortLabel: "Junior",
    color: colors.brandOrange,
    buttonType: "orange",
    supported: ENABLED_TOOLS.includes("junior"),
    icon: "logo-junior",
    level: "Principiante",
    landingText: `Da tus primeros pasos en la robótica con una programación por bloques sencilla e intuitiva.`,
    editorComponent: JuniorEditor
  },
  bloqs: {
    label: "Robótica",
    shortLabel: "Robótica",
    color: colors.green,
    supported: ENABLED_TOOLS.includes("bloqs"),
    icon: "logo-bloqs",
    level: "Medio",
    landingText:
      "Programa tus inventos por bloques y aprende los conceptos básicos de la programación."
  },
  code: {
    label: "Código Arduino®",
    shortLabel: "Arduino®",
    color: colors.brandPink,
    buttonType: "pink",
    icon: "logo-code",
    level: "Avanzado",
    landingText:
      "Da el salto al código con Arduino®. Crea tus primeros programas y da vida a tus robots.",
    supported: ENABLED_TOOLS.includes("code")
  },
  "3d": {
    label: "Diseño 3D",
    shortLabel: "Diseño 3D",
    color: colors.brandBlue,
    buttonType: "blue",
    supported: ENABLED_TOOLS.includes("3d"),
    icon: "logo-3d",
    level: "Medio",
    landingText:
      "Descubre las tres dimensiones, aprende geometría y convierte tus ideas en diseños.",
    editorComponent: ThreeDEditor
  },
  apps: {
    label: "Apps",
    shortLabel: "Apps",
    color: colors.brandYellow,
    buttonType: "yellow",
    icon: "logo-apps",
    level: "Avanzado",
    landingText:
      "Empieza a diseñar y programar tus propias apps para Android®, iOS® o PC.",
    supported: ENABLED_TOOLS.includes("apps")
  }
};

const defaultFlags = {
  RENEW_TOKEN_SECONDS: 60,
  TOKEN_DURATION_MINUTES: 60,
  TOKEN_WARNING_SECONDS: 300,
  SHOW_GRAPHQL_LOGS: false
};

let savedFlags = {};
if (typeof window !== `undefined`) {
  const savedFlagsString = window.localStorage.getItem("flags");
  if (savedFlagsString) {
    try {
      savedFlags = JSON.parse(savedFlagsString);
    } catch (e) {}
  }
}

export const flags = {
  ...defaultFlags,
  ...savedFlags
};

export const maxSTLFileSize = 5242880;

export const minChromeVersion = 69;

export const supportedLanguages = ["es", "en"];
export const defaultLanguage = "es";
