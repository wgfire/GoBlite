import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const components = [
  "accordion",
  "alert-dialog",
  "alert",
  "aspect-ratio",
  "avatar",
  "badge",
  "button",
  "calendar",
  "card",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "dropdown-menu",
  "hover-card",
  "input",
  "label",
  "menubar",
  "navigation-menu",
  "popover",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "tooltip"
];

const componentsDir = path.join(__dirname, "..", "src", "components");

// 确保组件目录存在
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

async function getLatestComponents() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/shadcn/ui/contents/cli/src/utils/registry/registry.json"
    );
    const content = await response.text();
    const registry = JSON.parse(content);
    return Object.keys(registry.components);
  } catch (error) {
    console.error("Error fetching components from GitHub:", error);
    return [];
  }
}

async function updateComponents() {
  let remoteComponents = await getLatestComponents();

  if (remoteComponents.length === 0) {
    console.log("No components found or error occurred. Using fallback list.");
    remoteComponents = components;
  }

  // 更新每个组件
  for (const component of remoteComponents) {
    console.log(`Updating ${component}...`);
    try {
      execSync(`npx shadcn-ui@latest add ${component}`, { stdio: "inherit" });
    } catch (error) {
      console.error(`Error updating ${component}:`, error);
    }
  }

  console.log("All components updated successfully!");
}

updateComponents();
