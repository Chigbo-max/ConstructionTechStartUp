import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';

const baseQuery = baseQueryWithReauth();

export const contractorsApi = createApi({
  reducerPath: 'contractorsApi',
  baseQuery,
  tagTypes: ['Contractor', 'ContractorProfile'],
  endpoints: (builder) => ({
    getContractors: builder.query({
      query: (params) => ({
        url: '/professionals/search',
        params: { ...params, profession: 'CONTRACTOR' },
      }),
      providesTags: ['Contractor'],
    }),
    getContractorById: builder.query({
      query: (id) => `/professionals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Contractor', id }],
    }),
    getContractorProfile: builder.query({
      query: () => '/professionals/profile',
      providesTags: ['ContractorProfile'],
    }),
    updateContractorProfile: builder.mutation({
      query: (profileData) => ({
        url: '/professionals/profile',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['ContractorProfile', 'Contractor'],
    }),
    getContractorProjects: builder.query({
      query: (contractorId) => `/professionals/${contractorId}/projects`,
      providesTags: ['Contractor'],
    }),
    getContractorReviews: builder.query({
      query: (contractorId) => `/professionals/${contractorId}/reviews`,
      providesTags: ['Contractor'],
    }),
    submitReview: builder.mutation({
      query: ({ contractorId, reviewData }) => ({
        url: `/professionals/${contractorId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Contractor'],
    }),
  }),
});

export const {
  useGetContractorsQuery,
  useGetContractorByIdQuery,
  useGetContractorProfileQuery,
  useUpdateContractorProfileMutation,
  useGetContractorProjectsQuery,
  useGetContractorReviewsQuery,
  useSubmitReviewMutation,
} = contractorsApi;