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

const createEntry = async (object: EntryFormValues) => {
  const { data } = await axios.post<EntryFormValues>(
    `${apiBaseUrl}/patients/:id/entries`,
    object
  );

  return data;
};

export default {
  getAll, create, createEntry
};

