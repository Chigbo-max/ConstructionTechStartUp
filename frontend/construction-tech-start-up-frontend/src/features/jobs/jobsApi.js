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

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery,
  tagTypes: ['Job', 'JobApplication'],
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (params) => ({
        url: '/jobs',
        params,
      }),
      providesTags: ['Job'],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation({
      query: (jobData) => ({
        url: '/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/jobs/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
    getJobApplications: builder.query({
      query: (jobId) => `/jobs/${jobId}/applications`,
      providesTags: ['JobApplication'],
    }),
    submitApplication: builder.mutation({
      query: ({ jobId, applicationData }) => ({
        url: `/jobs/${jobId}/applications`,
        method: 'POST',
        body: applicationData,
      }),
      invalidatesTags: ['JobApplication', 'Job'],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ jobId, applicationId, status }) => ({
        url: `/jobs/${jobId}/applications/${applicationId}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['JobApplication', 'Job'],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetJobApplicationsQuery,
  useSubmitApplicationMutation,
  useUpdateApplicationStatusMutation,
} = jobsApi;
