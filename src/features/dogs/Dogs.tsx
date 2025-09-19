import { useEffect, useRef, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useGetBreedsPaginatedQuery, useSearchBreedsQuery } from "./dog-api-slice"
import { ShimmerGrid } from "./Shimmer"

export default function Dogs() {
  const LIMIT = 12
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  const { data, isLoading, isError, refetch, isFetching, currentData } = useGetBreedsPaginatedQuery({ limit: LIMIT, page })
  const { data: searchResults, isLoading: isSearching, refetch: refetchSearch } = useSearchBreedsQuery({ q: debouncedSearch }, { skip: !debouncedSearch.trim() })

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset pagination when search changes
  useEffect(() => {
    if (debouncedSearch) {
      setPage(0)
      setHasMore(false)
      // Force refetch search results when search query changes
      if (debouncedSearch.trim()) {
        refetchSearch()
      }
    } else {
      setHasMore(true)
    }
  }, [debouncedSearch, refetchSearch])

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || debouncedSearch) return
    const el = sentinelRef.current
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting && !isFetching) {
        setPage((p) => p + 1)
      }
    }, { rootMargin: "600px 0px" })
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [isFetching, hasMore, debouncedSearch])

  useEffect(() => {
    if (!isFetching && !debouncedSearch) {
      const total = (currentData ?? data ?? []).length
      if (total > 0 && total % LIMIT !== 0) {
        setHasMore(false)
      }
    }
  }, [isFetching, currentData, data, LIMIT, debouncedSearch])

  // Determine which data to display
  const displayData = useMemo(() => {
    if (debouncedSearch) {
      return searchResults || []
    }
    return currentData ?? data ?? []
  }, [debouncedSearch, searchResults, currentData, data])

  // Determine loading state
  const isDisplayLoading = debouncedSearch ? isSearching : (isLoading && !currentData)

  if (isDisplayLoading) return (
    <div className="dogs">
      <h2>Dog Breeds</h2>
      <div className="search-container" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="text"
          placeholder="Search dog breeds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text)",
            fontSize: "16px"
          }}
        />
      </div>
      <ShimmerGrid count={12} />
    </div>
  )
  if (isError) return <div>Failed to load dog breeds. <button onClick={() => refetch()}>Retry</button></div>

  return (
    <div className="dogs">
      <h2>Dog Breeds</h2>
      <div className="search-container" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="text"
          placeholder="Search dog breeds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--text)",
            fontSize: "16px"
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--text)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              whiteSpace: "nowrap"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--muted)"
              e.currentTarget.style.borderColor = "var(--text)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--card)"
              e.currentTarget.style.borderColor = "var(--border)"
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>
      <div className="grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px"
      }}>
        {displayData.map((breed) => (
          <Link to={`/dogs/${breed.id}`} key={breed.id} className="card fade-in" style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 12,
            background: "var(--surface)",
            color: "inherit",
            textDecoration: "none",
            transition: "transform 160ms ease, box-shadow 160ms ease"
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingBottom: "56%",
              overflow: "hidden",
              borderRadius: 6,
              background: "var(--muted)"
            }}>
              {breed.image?.url && (
                <img
                  src={breed.image.url}
                  alt={breed.name}
                  loading="lazy"
                  sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 200px"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>{breed.name}</div>
              {breed.temperament && (
                <div style={{ fontSize: 12, opacity: 0.8 }}>{breed.temperament}</div>
              )}
              {breed.life_span && (
                <div style={{ fontSize: 12, opacity: 0.8 }}>Life span: {breed.life_span}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {!debouncedSearch && <div ref={sentinelRef} style={{ height: 1 }} />}
      {isFetching && !debouncedSearch && <div style={{ marginTop: 12 }}>Loading more...</div>}
      {!hasMore && !debouncedSearch && <div style={{ marginTop: 12, opacity: 0.7 }}>No more results.</div>}
      {debouncedSearch && displayData.length === 0 && !isSearching && (
        <div style={{ marginTop: 20, textAlign: "center", opacity: 0.7 }}>
          No breeds found for "{debouncedSearch}"
        </div>
      )}
    </div>
  )
}


