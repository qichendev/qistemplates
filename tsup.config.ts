import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ["esm"],
  sourcemap: true,
  target: "node20"
});
