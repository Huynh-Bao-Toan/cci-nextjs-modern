import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import type React from "react"

const setUrlState = vi.fn()

type UrlState = {
  q: string
  category: string
  sortBy: string
  sortOrder: string
  page: number
  limit: number
}

type UrlSetterOptions = {
  history?: "replace" | "push"
  shallow?: boolean
}

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => <span>{placeholder}</span>,
}))

vi.mock("nuqs", async () => {
  const React = await vi.importActual<typeof import("react")>("react")
  const actual = await vi.importActual<typeof import("nuqs")>("nuqs")
  return {
    ...actual,
    useQueryStates: () => {
      const [state, setState] = React.useState<UrlState>({
        q: "",
        category: "",
        sortBy: "",
        sortOrder: "",
        page: 1,
        limit: 12,
      })

      const setter = (patch: Partial<UrlState>, options: UrlSetterOptions) => {
        setUrlState(patch, options)
        setState((prev) => ({ ...prev, ...patch }))
      }

      return [state, setter]
    },
  }
})

import { ProductsToolbar } from "@/features/products-portal/components/products-toolbar"

describe("ProductsToolbar", () => {
  beforeEach(() => {
    setUrlState.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("debounces search and commits to URL state (replace)", async () => {
    render(<ProductsToolbar categories={["phones"]} />)

    const input = screen.getByPlaceholderText(/search products/i)
    fireEvent.change(input, { target: { value: "ip" } })

    expect(setUrlState).not.toHaveBeenCalled()

    vi.advanceTimersByTime(400)

    expect(setUrlState).toHaveBeenCalled()
    const [payload, options] = setUrlState.mock.calls.at(-1) ?? []
    expect(payload).toMatchObject({ q: "ip", page: 1 })
    expect(options).toMatchObject({ history: "replace", shallow: true })
  })
})

