import { useState, useEffect, SyntheticEvent } from "react";
import { Typography, TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';
import { PatientFormValues, Patient, Gender } from "../../types";
import { apiBaseUrl } from "../../constants";

interface Props {
  patientId: string;
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

interface GenderOption{
  value: Gender;
  label: string;
}

const genderOptions: GenderOption[] = Object.values(Gender).map(v => ({
  value: v, label: v.toString()
}));

const ShowPatient = ({ patientId="{patientId}", onCancel, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [ssn, setSsn] = useState<string>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [gender, setGender] = useState(Gender.Other);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        //const response = await fetch(`${apiBaseUrl}/patients`);
        //const response = await fetch(`${apiBaseUrl}/patients?patientId=${patientId}`);
        const response = await fetch(`${apiBaseUrl}/patients?patientId=${encodeURIComponent(patientId)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Patient[] = await response.json();
        setName(data[0].name);
        setDateOfBirth(data[0].dateOfBirth);
        setSsn(data[0].ssn);
        setOccupation(data[0].occupation);
        setGender(data[0].gender);
        setData(data[0]);
        console.log("show patient useEffect.");
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const onGenderChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const gender = Object.values(Gender).find(g => g.toString() === value);
      if (gender) {
        setGender(gender);
      }
    }
  };

  // <pre>{JSON.stringify(data, null, 2)}</pre>

  return (
    <div>
      <Typography variant="body1">Name: {name}</Typography>
      <Typography variant="body1">SSN: {ssn}</Typography>
      <Typography variant="body1">Date of birth: {dateOfBirth}</Typography>
      <Typography variant="body1">Occupation: {occupation}</Typography>
      <Typography variant="body1">Gender: {gender}</Typography>

      <Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            style={{ float: "left", marginTop: 20 }}
            type="button"
            onClick={onCancel}
          >
            Close
          </Button>
        </Grid>
        
      </Grid>
    </div>
  );
};

export default ShowPatient;