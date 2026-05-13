import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Syncfusion Premium Dark Theme (Fluent Dark)
import "@syncfusion/ej2-base/styles/fluent-dark.css";
import "@syncfusion/ej2-react-grids/styles/fluent-dark.css";
import "@syncfusion/ej2-react-inputs/styles/fluent-dark.css";
import "@syncfusion/ej2-react-navigations/styles/fluent-dark.css";
import "@syncfusion/ej2-react-popups/styles/fluent-dark.css";
import "@syncfusion/ej2-react-notifications/styles/fluent-dark.css";
import "@syncfusion/ej2-react-calendars/styles/fluent-dark.css";
import "@syncfusion/ej2-react-dropdowns/styles/fluent-dark.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import MainLayout from "@/components/Layout/MainLayout";

export const metadata: Metadata = {
  title: "Orders Management Platform",
  description: "Enterprise level order management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}