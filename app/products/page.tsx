"use client";
import { useEffect, useState } from "react";
import { registerLicense } from "@syncfusion/ej2-base";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Filter, Sort, Inject, Toolbar } from "@syncfusion/ej2-react-grids";
import { getProducts } from "../../services/api";
import Link from "next/link";

registerLicense("Ngo9BigBOggjGyl/VkV+XU9AclREQmBWfFN0Q3NbdVp2fldBcDwsT3RfQFtjTH5Xd0FmWX5deHJdQmtfUg==");

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => { getProducts().then(setProducts); }, []);

  return (
    <>
      <nav className="navbar">
        <h1>📦 Orders Management</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/orders">Pedidos</Link>
          <Link href="/products">Productos</Link>
        </nav>
      </nav>
      <div className="page">
        <h2 className="page-title">Productos</h2>
        <div className="section">
          <GridComponent dataSource={products} allowPaging allowFiltering allowSorting toolbar={["Search"]}>
            <ColumnsDirective>
              <ColumnDirective field="productName" headerText="Producto" width="200" />
              <ColumnDirective field="package" headerText="Presentación" width="180" />
              <ColumnDirective field="unitPrice" headerText="Precio" width="120" format="C2" />
              <ColumnDirective field="supplier.companyName" headerText="Proveedor" width="200" />
              <ColumnDirective field="supplier.country" headerText="País Proveedor" width="150" />
            </ColumnsDirective>
            <Inject services={[Page, Filter, Sort, Toolbar]} />
          </GridComponent>
        </div>
      </div>
    </>
  );
}