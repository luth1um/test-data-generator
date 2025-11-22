export default {
  base: "/test-data-generator/",
  build: {
    outDir: "dist/test-data-generator",
  },
  test: {
    exclude: ["**/node_modules/**", "e2e/**"],
  },
  server: {
    open: true,
  },
};
