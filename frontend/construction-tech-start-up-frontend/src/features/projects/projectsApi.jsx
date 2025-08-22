import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';

const baseQuery = baseQueryWithReauth();

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery,
  tagTypes: ['Project', 'Bid'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/projects/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
    getBids: builder.query({
      query: (projectId) => `/projects/${projectId}/bids`,
      providesTags: ['Bid'],
    }),
    submitBid: builder.mutation({
      query: ({ projectId, bidData }) => ({
        url: `/projects/${projectId}/bids`,
        method: 'POST',
        body: bidData,
      }),
      invalidatesTags: ['Bid', 'Project'],
    }),
    assignBid: builder.mutation({
      query: ({ projectId, bidId }) => ({
        url: `/projects/${projectId}/bids/${bidId}/assign`,
        method: 'PUT',
      }),
      invalidatesTags: ['Bid', 'Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetBidsQuery,
  useSubmitBidMutation,
  useAssignBidMutation,
} = projectsApi;
