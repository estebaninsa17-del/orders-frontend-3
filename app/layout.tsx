import type { Metadata } from "next";
import "./globals.css";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import "@syncfusion/ej2-react-inputs/styles/material.css";

export const metadata: Metadata = {
  title: "Orders Management",
  description: "Sistema de gestión de pedidos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}