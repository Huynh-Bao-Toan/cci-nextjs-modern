"use client"

import { useEffect, useMemo, useState } from "react"

import { debounce } from "es-toolkit/function"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type ProductsSearchMode = "manual" | "debounced"

type ProductsSearchBoxProps = {
  label?: string
  placeholder?: string
  value: string
  mode?: ProductsSearchMode
  debounceMs?: number
  onSearch: (term: string) => void
}

export function ProductsSearchBox({
  label = "Search",
  placeholder = "Search products...",
  value,
  mode = "manual",
  debounceMs = 400,
  onSearch,
}: ProductsSearchBoxProps) {
  const [inputValue, setInputValue] = useState(value)

  // Đồng bộ local state khi giá trị từ URL thay đổi (reset, back/forward, v.v.)
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        if (term === value) return
        onSearch(term)
      }, debounceMs),
    [debounceMs, onSearch, value],
  )

  // Hủy debounce khi unmount để tránh leak
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Debounce auto-search nếu bật mode "debounced"
  useEffect(() => {
    if (mode !== "debounced") return
    debouncedSearch(inputValue)
  }, [inputValue, mode, debouncedSearch])

  const handleCommitSearch = () => {
    if (mode !== "manual") return
    if (inputValue === value) return
    onSearch(inputValue)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <div className="flex min-w-0 items-center gap-2">
        <Input
          type="search"
          className="text-xs flex-1"
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return
            handleCommitSearch()
          }}
        />
        {mode === "manual" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="shrink-0 text-xs"
            onClick={handleCommitSearch}
          >
            Search
          </Button>
        )}
      </div>
    </div>
  )
}

