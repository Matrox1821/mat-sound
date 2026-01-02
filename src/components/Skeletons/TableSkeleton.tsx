import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";

function ArtistsTableSkeleton() {
  const items = new Array(6).fill(null);
  return (
    <div className="p-datatable-striped">
      <Column field="image" header="Imagen" style={{ width: "25%" }} body={<Skeleton />}></Column>
      <Column field="name" header="Nombre" style={{ width: "25%" }} body={<Skeleton />}></Column>
      <Column field="delete" header="Borrar" style={{ width: "25%" }} body={<Skeleton />}></Column>
    </div>
  );
}
export { ArtistsTableSkeleton };
