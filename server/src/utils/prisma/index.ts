import { PrismaClient } from "@prisma/client";
import type { LogLevel } from "@prisma/client/runtime/library";

const logLevels: LogLevel[] = ["error", "info", "warn"];
const prisma = new PrismaClient({
  log: logLevels,
});

export default prisma;
