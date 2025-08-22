import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';

const baseQuery = baseQueryWithReauth();

export const bidsApi = createApi({
  reducerPath: 'bidsApi',
  baseQuery,
  tagTypes: ['Bid'],
  endpoints: (builder) => ({
    getAllBids: builder.query({
      query: (params) => ({
        url: '/bids',
        params,
      }),
      providesTags: ['Bid'],
    }),
    getBidById: builder.query({
      query: (id) => `/bids/${id}`,
      providesTags: (result, error, id) => [{ type: 'Bid', id }],
    }),
    createBid: builder.mutation({
      query: (bidData) => ({
        url: '/bids/create',
        method: 'POST',
        body: bidData,
      }),
      invalidatesTags: ['Bid'],
    }),
    updateBid: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/bids/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Bid', id }],
    }),
    deleteBid: builder.mutation({
      query: (id) => ({
        url: `/bids/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bid'],
    }),
    assignBid: builder.mutation({
      query: (bidData) => ({
        url: '/bids/assign',
        method: 'POST',
        body: bidData,
      }),
      invalidatesTags: ['Bid'],
    }),
    getBidsByProject: builder.query({
      query: (projectId) => `/projects/${projectId}/bids`,
      providesTags: ['Bid'],
    }),
    getBidsByContractor: builder.query({
      query: (contractorId) => `/professionals/${contractorId}/bids`,
      providesTags: ['Bid'],
    }),
  }),
});

export const {
  useGetAllBidsQuery,
  useGetBidByIdQuery,
  useCreateBidMutation,
  useUpdateBidMutation,
  useDeleteBidMutation,
  useAssignBidMutation,
  useGetBidsByProjectQuery,
  useGetBidsByContractorQuery,
} = bidsApi;