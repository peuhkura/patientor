import axios from "axios";
import { Patient, PatientFormValues, EntryFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const createEntry = async (patientId: string, object: EntryFormValues) => {
  try {
      const { data } = await axios.post<EntryFormValues>(
      `${apiBaseUrl}/patients/${patientId}/entries`,
      object
    );
    return data;
  } catch (error) {
    // Check if the error is an Axios error
    if (axios.isAxiosError(error)) {
      // Handle the error response from the backend
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        throw new Error(error.response.data.error || 'An error occurred');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        throw new Error('No response received from the server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        throw new Error(error.message);
      }
    } else {
      // If the error is not an Axios error
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

export default {
  getAll, create, createEntry
};

