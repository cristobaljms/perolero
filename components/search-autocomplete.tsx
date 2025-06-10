"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { SEARCH_SUGGESTIONS } from "@/utils/constants"

export default function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Debounce para optimizar el filtrado
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 150) // 150ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query])

  // Memoizar las sugerencias filtradas
  const filteredSuggestions = useMemo(() => {
    if (debouncedQuery.trim() === "") {
      return []
    }

    const lowerQuery = debouncedQuery.toLowerCase()
    return SEARCH_SUGGESTIONS.filter((suggestion) => 
      suggestion.toLowerCase().includes(lowerQuery)
    ).slice(0, 8) // Limitar a 8 resultados para mejor rendimiento
  }, [debouncedQuery])

  // Actualizar visibilidad de sugerencias
  useEffect(() => {
    setShowSuggestions(filteredSuggestions.length > 0 && debouncedQuery.trim() !== "")
    setActiveSuggestionIndex(-1)
  }, [filteredSuggestions, debouncedQuery])

  // Cerrar sugerencias al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Flecha abajo
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (activeSuggestionIndex < filteredSuggestions.length - 1) {
        setActiveSuggestionIndex((prev) => prev + 1)
      }
    }
    // Flecha arriba
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex((prev) => prev - 1)
      }
    }
    // Enter
    else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault()
      setQuery(filteredSuggestions[activeSuggestionIndex])
      setShowSuggestions(false)
    }
    // Escape
    else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    const params = new URLSearchParams(window.location.search);
    params.set("q", query);
    router.push(`/anuncios?${params.toString()}`);
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() !== "" && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="pr-10"
            aria-label="Campo de búsqueda con autocompletado"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-activedescendant={activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined}
          />
          <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
            <Search className="h-4 w-4" />
            <span className="sr-only">Buscar</span>
          </Button>
        </div>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
          role="listbox"
        >
          <ul className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                id={`suggestion-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm",
                  index === activeSuggestionIndex && "bg-gray-100",
                )}
                role="option"
                aria-selected={index === activeSuggestionIndex}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
