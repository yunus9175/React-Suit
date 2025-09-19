import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Minimal typings for TheDogAPI /breeds response
// https://docs.thedogapi.com/
export interface DogBreedImage {
  id?: string
  url?: string
}

export interface DogBreed {
  id: number
  name: string
  temperament?: string
  life_span?: string
  weight?: { imperial: string; metric: string }
  height?: { imperial: string; metric: string }
  bred_for?: string
  breed_group?: string
  origin?: string
  image?: DogBreedImage
}
const API_KEY = "live_MwJYMrYbHgBv8jWLGB7kmPMZUksl78D7q3xPOqxfnGxnJjnwB4jlaNNrnNCledjS"
const DOG_API_URL = "https://api.thedogapi.com/v1"

export const dogApi = createApi({
  reducerPath: "dogApi",
  baseQuery: fetchBaseQuery({ baseUrl: DOG_API_URL, headers: { "x-api-key": API_KEY } }),
  endpoints: (builder) => ({
    getBreeds: builder.query<DogBreed[], void>({
      query: () => "/breeds",
    }),
    getBreedsPaginated: builder.query<DogBreed[], { limit: number; page: number }>({
      query: ({ limit, page }) => `/breeds?limit=${limit}&page=${page}`,
      serializeQueryArgs: ({ queryArgs }) => `breeds-${queryArgs.limit}`,
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems)
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.limit !== previousArg?.limit
      },
    }),
    searchBreeds: builder.query<DogBreed[], { q: string }>({
      query: ({ q }) => `/breeds/search?q=${encodeURIComponent(q)}`,
      serializeQueryArgs: ({ queryArgs }) => {
        return { endpointName: 'searchBreeds', args: queryArgs }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.q !== previousArg?.q
      },
    }),
    getBreedById: builder.query<DogBreed, number>({
      query: (id) => `/breeds/${id}`,
    }),
    getImagesByBreed: builder.query<{ id: string; url: string }[], { breedId: number; limit?: number; page?: number }>({
      query: ({ breedId, limit = 6, page = 0 }) => `/images/search?breed_ids=${breedId}&limit=${limit}&page=${page}`,
    }),
  }),
})

export const { useGetBreedsQuery, useGetBreedsPaginatedQuery, useSearchBreedsQuery, useGetBreedByIdQuery, useGetImagesByBreedQuery } = dogApi
