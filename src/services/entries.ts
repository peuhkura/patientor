import axios from "axios";
import { Entry, EntryFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Entry[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: EntryFormValues) => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

export default {
  getAll, create
};

