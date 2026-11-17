import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Pakai tanda ! dan as string agar TS diam
    url: (process.env.DATABASE_URL as string)!,
    // @ts-ignore - Tambahkan ini kalau directUrl masih bandel merah
    directUrl: (process.env.DIRECT_URL as string)!,
  },
});