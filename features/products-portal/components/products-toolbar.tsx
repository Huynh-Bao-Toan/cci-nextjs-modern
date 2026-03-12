"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";

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

import {
  PRODUCTS_SORT_BY_OPTIONS,
  PRODUCTS_SORT_ORDER_OPTIONS,
} from "../lib/products.constants";
import { productsUrlState } from "../lib/products.url-state";

type ProductsToolbarProps = {
  categories: string[];
};

export function ProductsToolbar({ categories }: ProductsToolbarProps) {
  const [urlState, setUrlState] = useQueryStates(productsUrlState);

  const categoryOptions = useMemo(
    () => ["all", ...categories.filter(Boolean)],
    [categories],
  );

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
            value={urlState.q ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setUrlState(
                { q: value || null, page: 1 },
                { history: "replace", shallow: true, scroll: false },
              );
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              setUrlState(
                { q: event.currentTarget.value || null, page: 1 },
                { history: "push", shallow: true, scroll: false },
              );
            }}
          />
        </div>

        <div className="flex w-full flex-1 min-w-[150px] flex-col gap-1 sm:w-auto sm:max-w-[220px]">
          <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </Label>
          <Select
            value={urlState.category ? urlState.category : "all"}
            onValueChange={(value) =>
              setUrlState(
                { category: value === "all" ? null : value, page: 1 },
                { history: "push", shallow: true, scroll: false },
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

        <div className="flex w-full flex-1 min-w-[150px] flex-col gap-1 sm:w-auto sm:max-w-[200px]">
          <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Sort
          </Label>
          <Select
            value={urlState.sortBy || "title"}
            onValueChange={(value) =>
              setUrlState(
                { sortBy: value || null, page: 1 },
                { history: "push", shallow: true, scroll: false },
              )
            }
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS_SORT_BY_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full flex-1 min-w-[150px] flex-col gap-1 sm:w-auto sm:max-w-[200px]">
          <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Order
          </Label>
          <Select
            value={urlState.sortOrder || "asc"}
            onValueChange={(value) =>
              setUrlState(
                { sortOrder: value || null, page: 1 },
                { history: "push", shallow: true, scroll: false },
              )
            }
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS_SORT_ORDER_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs"
                >
                  {opt.label}
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
            setUrlState(
              {
                q: null,
                category: null,
                sortBy: null,
                sortOrder: null,
                page: 1,
              },
              { history: "push", shallow: true, scroll: false },
            );
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
