import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useGetBreedByIdQuery, useGetImagesByBreedQuery } from "./dog-api-slice"
import { Shimmer } from "./Shimmer"

export default function DogDetails() {
  const params = useParams()
  const id = Number(params.id)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { data: breed, isLoading, isError, refetch } = useGetBreedByIdQuery(id, { skip: Number.isNaN(id) })
  const { data: images } = useGetImagesByBreedQuery({ breedId: id, limit: 12 })

  if (Number.isNaN(id)) return <div>Invalid breed id.</div>
  
  if (isLoading) return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link to="/dogs" style={{ color: "var(--muted)", textDecoration: "none" }}>← Back to Dogs</Link>
      </div>
      <Shimmer width="200px" height="32px" style={{ marginBottom: 16 }} />
      <div className="dog-details-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Shimmer width="100%" height="400px" borderRadius="12px" />
        <div>
          <Shimmer width="100%" height="20px" style={{ marginBottom: 12 }} />
          <Shimmer width="80%" height="16px" style={{ marginBottom: 8 }} />
          <Shimmer width="90%" height="16px" style={{ marginBottom: 8 }} />
          <Shimmer width="70%" height="16px" />
        </div>
      </div>
    </div>
  )
  
  if (isError || !breed) return <div>Failed to load breed. <button onClick={() => refetch()}>Retry</button></div>

  const heroImage = selectedImage || breed.image?.url || (images && images[0]?.url)

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Link to="/dogs" style={{ color: "var(--muted)", textDecoration: "none" }}>← Back to Dogs</Link>
      </div>
      
      <h1 style={{ marginBottom: 24 }}>{breed.name}</h1>
      
      <div className="dog-details-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
        {/* Hero Image */}
        <div>
          <div className="dog-details-hero" style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "75%",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--muted)",
            marginBottom: 16
          }}>
            {heroImage && (
              <img
                src={heroImage}
                alt={breed.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  backgroundColor: "var(--muted)"
                }}
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {images && images.length > 0 && (
            <div>
              <h3 style={{ marginBottom: 12 }}>Gallery</h3>
              <div className="dog-details-gallery" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    style={{
                      padding: 0,
                      border: selectedImage === img.url ? "2px solid #646cff" : "2px solid var(--border)",
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "transparent",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease"
                    }}
                  >
                    <img
                      src={img.url}
                      alt={breed.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: 60,
                        objectFit: "cover",
                        display: "block",
                        backgroundColor: "var(--muted)"
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breed Information */}
        <div>
          <div className="dog-details-info" style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 24
          }}>
            <h2 style={{ marginBottom: 20 }}>Breed Information</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {breed.temperament && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Temperament</h4>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{breed.temperament}</p>
                </div>
              )}
              
              {breed.life_span && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Life Span</h4>
                  <p style={{ margin: 0 }}>{breed.life_span}</p>
                </div>
              )}
              
              {breed.weight && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Weight</h4>
                  <p style={{ margin: 0 }}>{breed.weight.imperial} lbs ({breed.weight.metric} kg)</p>
                </div>
              )}
              
              {breed.height && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Height</h4>
                  <p style={{ margin: 0 }}>{breed.height.imperial} inches ({breed.height.metric} cm)</p>
                </div>
              )}
              
              {breed.bred_for && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Bred For</h4>
                  <p style={{ margin: 0 }}>{breed.bred_for}</p>
                </div>
              )}
              
              {breed.breed_group && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Breed Group</h4>
                  <p style={{ margin: 0 }}>{breed.breed_group}</p>
                </div>
              )}
              
              {breed.origin && (
                <div>
                  <h4 style={{ margin: "0 0 8px 0", color: "var(--muted)" }}>Origin</h4>
                  <p style={{ margin: 0 }}>{breed.origin}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


