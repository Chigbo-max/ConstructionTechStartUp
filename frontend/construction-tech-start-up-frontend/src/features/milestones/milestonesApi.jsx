import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const milestonesApi = createApi({
  reducerPath: 'milestonesApi',
  baseQuery,
  tagTypes: ['Milestone'],
  endpoints: (builder) => ({
    getMilestones: builder.query({
      query: (projectId) => `/projects/${projectId}/milestones`,
      providesTags: ['Milestone'],
    }),
    getMilestoneById: builder.query({
      query: ({ projectId, milestoneId }) => `/projects/${projectId}/milestones/${milestoneId}`,
      providesTags: (result, error, { milestoneId }) => [{ type: 'Milestone', id: milestoneId }],
    }),
    createMilestone: builder.mutation({
      query: ({ projectId, milestoneData }) => ({
        url: `/projects/${projectId}/milestones`,
        method: 'POST',
        body: milestoneData,
      }),
      invalidatesTags: ['Milestone'],
    }),
    updateMilestone: builder.mutation({
      query: ({ projectId, milestoneId, ...updateData }) => ({
        url: `/projects/${projectId}/milestones/${milestoneId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { milestoneId }) => [{ type: 'Milestone', id: milestoneId }],
    }),
    deleteMilestone: builder.mutation({
      query: ({ projectId, milestoneId }) => ({
        url: `/projects/${projectId}/milestones/${milestoneId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Milestone'],
    }),
    completeMilestone: builder.mutation({
      query: ({ projectId, milestoneId }) => ({
        url: `/projects/${projectId}/milestones/${milestoneId}/complete`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { milestoneId }) => [{ type: 'Milestone', id: milestoneId }],
    }),
  }),
});

export const {
  useGetMilestonesQuery,
  useGetMilestoneByIdQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
  useCompleteMilestoneMutation,
} = milestonesApi;
