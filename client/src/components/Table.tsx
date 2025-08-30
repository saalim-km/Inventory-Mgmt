import { useEffect, useCallback } from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SkipBack } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";

type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
};

type Action<T> = {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ReusableTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  currentPage: number;
  isLoading?: boolean;
  emptyMessage?: string;
};

export function ReusableTable<T>({
  columns,
  data,
  actions = [],
  itemsPerPage,
  totalItems,
  onPageChange,
  currentPage,
  isLoading = false,
  emptyMessage = "No data available",
}: ReusableTableProps<T>) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate pagination range with ellipsis for large page counts
  const getPaginationRange = useCallback(() => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    const sidePages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - sidePages);
    let endPage = Math.min(totalPages, currentPage + sidePages);

    if (endPage - startPage < maxPagesToShow - 1) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // Add page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages]
  );

  // Reset to page 1 when totalItems or itemsPerPage changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      goToPage(1);
    }
  }, [totalItems, itemsPerPage, currentPage, totalPages, goToPage]);

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={String(column.key)} 
                    className="text-gray-700 font-medium py-3"
                  >
                    {column.header}
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-[80px] text-gray-700 font-medium py-3">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50">
                  {columns.map((column) => (
                    <TableCell key={String(column.key)} className="py-3">
                      <SkipBack className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="py-3">
                      <SkipBack className="h-8 w-8 rounded-full" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={String(column.key)} 
                  className="text-gray-700 font-medium py-3"
                >
                  {column.header}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-[80px] text-gray-700 font-medium py-3">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-10 text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-3 mb-3">
                      <MoreHorizontal className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-b-0">
                  {columns.map((column) => (
                    <TableCell 
                      key={String(column.key)} 
                      className={`py-3 ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(row[column.key as keyof T], row)
                        : String(row[column.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-gray-200"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="bg-white rounded-md shadow-lg p-1 min-w-[150px] border border-gray-200"
                        >
                          {actions.map((action, idx) => (
                            <DropdownMenuItem
                              key={idx}
                              onClick={() => action.onClick(row)}
                              className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer ${
                                action.variant === "destructive" 
                                  ? "text-red-600 hover:bg-red-50" 
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPaginationRange().map((page, index) => (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => typeof page === "number" && goToPage(page)}
                disabled={typeof page !== "number"}
                className="h-8 w-8 p-0 min-w-8"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}