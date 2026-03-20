import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tells Turbopack/Next to avoid bundling these server-side
  serverExternalPackages: ["jspdf", "jspdf-autotable", "fflate"],
};

export default nextConfig;
