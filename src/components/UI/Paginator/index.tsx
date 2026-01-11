"use client";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { Paginator as PrimeReactPaginator } from "primereact/paginator";
import { use, useState } from "react";

export default function Paginator({
  paginationInfo,
}: {
  paginationInfo: Promise<{ amount: number; pages: number } | undefined>;
}) {
  const info = use(paginationInfo);
  if (!info?.amount) return;
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pathname = usePathname();
  const rowsPerPage = 6;
  const [first, setFirst] = useState((currentPage - 1) * rowsPerPage);
  const [rows, setRows] = useState(rowsPerPage);

  const createPageUrl = (page: number, rows: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${page}`);
    params.set("rows", `${rows}`);

    return params;
  };

  const onPageChange = (e: { first: number; rows: number }) => {
    setFirst(e.first);
    setRows(e.rows);
    const newCurrentPage = Math.floor(e.first / e.rows) + 1;
    const newParams = createPageUrl(newCurrentPage, e.rows);
    redirect(`${pathname}?${newParams.toString()}`);
  };
  return (
    <PrimeReactPaginator
      first={first}
      totalRecords={info.amount}
      rows={rows}
      rowsPerPageOptions={[rowsPerPage, rowsPerPage * 2, rowsPerPage * 3]}
      onPageChange={onPageChange}
      className="!rounded-tl-none !rounded-tr-none !border-0 !bg-background-900"
    ></PrimeReactPaginator>
  );
}
