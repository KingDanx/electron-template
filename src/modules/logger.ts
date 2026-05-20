import LiteLogger from "@kingdanx/litelogger";
import { getResourcePath } from "./helpers.ts";

export default new LiteLogger(getResourcePath(), "log", "logs", 14);
