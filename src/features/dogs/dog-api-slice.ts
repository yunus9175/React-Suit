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

export interface Vote {
  id: number
  image_id: string
  sub_id?: string
  value: number
  created_at: string
  country_code?: string
}

export interface Favourite {
  id: number
  user_id: string
  image_id: string
  sub_id?: string
  created_at: string
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
    // Votes endpoints
    getVotes: builder.query<Vote[], void>({
      query: () => "/votes",
    }),
        createVote: builder.mutation<Vote, { image_id: string; value: number }>({
          query: (body) => ({
            url: "/votes",
            method: "POST",
            body,
          }),
        }),
    deleteVote: builder.mutation<void, number>({
      query: (voteId) => ({
        url: `/votes/${voteId}`,
        method: "DELETE",
      }),
    }),
    // Favourites endpoints
    getFavourites: builder.query<Favourite[], void>({
      query: () => "/favourites",
    }),
    createFavourite: builder.mutation<Favourite, { image_id: string }>({
      query: (body) => ({
        url: "/favourites",
        method: "POST",
        body,
      }),
    }),
    deleteFavourite: builder.mutation<void, number>({
      query: (favouriteId) => ({
        url: `/favourites/${favouriteId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { 
  useGetBreedsQuery, 
  useGetBreedsPaginatedQuery, 
  useSearchBreedsQuery, 
  useGetBreedByIdQuery, 
  useGetImagesByBreedQuery,
  useGetVotesQuery,
  useCreateVoteMutation,
  useDeleteVoteMutation,
  useGetFavouritesQuery,
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation
} = dogApi
