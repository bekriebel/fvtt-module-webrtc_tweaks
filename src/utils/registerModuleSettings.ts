import { MODULE_NAME } from "./constants";
import { delayReload, getGame, registerModuleSetting } from "./helpers";
import * as log from "./logging";

export default function registerModuleSettings(): void {
  // Register debug logging setting
  registerModuleSetting({
    name: "debug",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: () => delayReload(),
  });

  // Set the initial debug level
  log.setDebug(getGame().settings.get(MODULE_NAME, "debug") === true);
}
