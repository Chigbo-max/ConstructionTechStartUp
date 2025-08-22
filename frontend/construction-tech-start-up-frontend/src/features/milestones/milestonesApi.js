import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';

const baseQuery = baseQueryWithReauth();

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
