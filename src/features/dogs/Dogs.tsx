import { useEffect, useRef, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { useGetBreedsPaginatedQuery, useSearchBreedsQuery, useGetFavouritesQuery, useCreateFavouriteMutation, useDeleteFavouriteMutation, useCreateVoteMutation, useGetVotesQuery, type Vote } from "./dog-api-slice"
import { ShimmerGrid } from "./Shimmer"

export default function Dogs() {
  const LIMIT = 12
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  const { data, isLoading, isError, refetch, isFetching, currentData } = useGetBreedsPaginatedQuery({ limit: LIMIT, page })
  const { data: searchResults, isLoading: isSearching, refetch: refetchSearch } = useSearchBreedsQuery({ q: debouncedSearch }, { skip: !debouncedSearch.trim() })
  const { data: favourites } = useGetFavouritesQuery()
  const { data: votes, refetch: refetchVotes } = useGetVotesQuery()
  const [createFavourite] = useCreateFavouriteMutation()
  const [deleteFavourite] = useDeleteFavouriteMutation()
  const [createVote] = useCreateVoteMutation()

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

  // Helper functions for favourites and votes
  const isFavourite = (imageId: string) => {
    return favourites?.some(fav => fav.image_id === imageId) || false
  }

  const getVoteValue = (imageId: string) => {
    const vote = votes?.find((v: Vote) => v.image_id === imageId)
    return vote ? vote.value : null
  }

  const handleFavourite = async (imageId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      if (isFavourite(imageId)) {
        const favourite = favourites?.find(fav => fav.image_id === imageId)
        if (favourite) {
          await deleteFavourite(favourite.id)
        }
      } else {
        await createFavourite({ image_id: imageId })
      }
    } catch (error) {
      console.error('Error handling favourite:', error)
    }
  }

  const handleVote = async (imageId: string, value: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await createVote({ image_id: imageId, value }).unwrap()
      // Refetch votes to update the UI immediately
      refetchVotes()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

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
          <div key={breed.id} className="card fade-in" style={{
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 12,
            background: "var(--surface)",
            transition: "transform 160ms ease, box-shadow 160ms ease"
          }}>
            <Link to={`/dogs/${breed.id}`} style={{ color: "inherit", textDecoration: "none" }}>
              <div style={{
                position: "relative",
                width: "100%",
                height: 0,
                paddingBottom: "56%",
                overflow: "hidden",
                borderRadius: 6,
                background: isFetching ? "var(--muted)" : ""
              }}>
                {breed.image?.url && (
                  <img
                    src={breed.image.url}
                    alt={breed.name}
                    loading="lazy"
                    sizes="(max-width: 600px) 50vw, (max-width: 1200px) 33vw, 200px"
                    style={{ 
                      position: "absolute", 
                      inset: 0, 
                      width: "100%", 
                      height: "100% !important", 
                      objectFit: "fill",
                      backgroundColor: "var(--muted)"
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
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
            
            {/* Vote and Favourite buttons */}
            {breed.image?.id && (
              <div style={{ 
                display: "flex", 
                gap: 8, 
                marginTop: 12, 
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={(e) => handleVote(breed.image!.id!, 1, e)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      opacity: getVoteValue(breed.image!.id!) === 1 ? 1 : 0.5,
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {getVoteValue(breed.image!.id!) === 1 ? "👍" : "👍🏻"}
                  </button>
                  <button
                    onClick={(e) => handleVote(breed.image!.id!, 0, e)}
                    style={{
                      padding: "6px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      opacity: getVoteValue(breed.image!.id!) === 0 ? 1 : 0.5,
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {getVoteValue(breed.image!.id!) === 0 ? "👎" : "👎🏻"}
                  </button>
                </div>
                <button
                  onClick={(e) => handleFavourite(breed.image!.id!, e)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: isFavourite(breed.image!.id!) ? "#ff6b6b" : "var(--card)",
                    opacity: isFavourite(breed.image!.id!) ? 1 : 0.5,
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isFavourite(breed.image!.id!) ? "❤️" : "🤍"}
                </button>
              </div>
            )}
          </div>
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


