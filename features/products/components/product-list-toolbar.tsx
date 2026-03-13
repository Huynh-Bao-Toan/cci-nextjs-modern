"use client";

import { useMemo, useState } from "react";
import { useQueryStates } from "nuqs";
import { debounce } from "es-toolkit/function";

import { productsUrlState } from "../lib/product-url-state";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductListToolbarProps = {
  categories: string[];
};

export function ProductListToolbar({ categories }: ProductListToolbarProps) {
  const [filters, setFilters] = useQueryStates(productsUrlState);

  const [searchInput, setSearchInput] = useState(filters.q ?? "");

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilters({ q: value, page: 1 }, { shallow: false });
      }, 400),
    [setFilters],
  );

  const categoryOptions = useMemo(() => ["all", ...categories], [categories]);
  const selectedCategory = filters.category ? filters.category : "all";

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-3 text-xs sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-1 flex-wrap items-end gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </Label>
          <Input
            type="search"
            className="text-xs"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) => {
              const value = event.target.value;
              setSearchInput(value);
              debouncedUpdateSearch(value);
            }}
          />
        </div>
        <div className="flex w-full flex-1 min-w-[150px] flex-col gap-1 sm:w-auto sm:max-w-[220px]">
          <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) =>
              setFilters(
                { category: value === "all" ? null : value, page: 1 },
                { shallow: false },
              )
            }
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((value) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {value === "all" ? "All categories" : value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setFilters(
              {
                q: "",
                category: null,
                page: 1,
              },
              { shallow: false },
            );
            setSearchInput("");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
