import { useState, SyntheticEvent } from "react";

import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';

import {  HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry, EntryFormValues, Discharge, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  //const [type, setType] = useState('');
  const [type, setType] = useState<'HealthCheck' | 'OccupationalHealthcare' | 'Hospital'>('HealthCheck');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [employerName, setEmployerName] = useState('');
  const [discharge, setDischarge] = useState<Discharge>({ date: '', criteria: '' });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const baseEntry = {
      id: '1', // This should be generated uniquely
      description,
      date,
      specialist
    };
    
    if (type === 'HealthCheck') {
      const newEntry: HealthCheckEntry = {
        ...baseEntry,
        type: 'HealthCheck',
        healthCheckRating
      };
      onSubmit(newEntry);
    } else if (type === 'OccupationalHealthcare') {
      const newEntry: OccupationalHealthcareEntry = {
        ...baseEntry,
        type: 'OccupationalHealthcare',
        employerName
      };
      onSubmit(newEntry);
    } else if (type === 'Hospital') {
      const newEntry: HospitalEntry = {
        ...baseEntry,
        type: 'Hospital',
        diagnosisCodes,
        discharge
      };
      onSubmit(newEntry);
    }
  };

  /*const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      date,
      specialist,
      diagnosisCodes,
      type
    });
  };*/

  return (
    <div>
      <form onSubmit={handleSubmit}>



        <TextField
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth 
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

       <label>
          Entry Type:
          <select value={type} onChange={(e) => setType(e.target.value as 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital')}>
            <option value="HealthCheck">Health Check</option>
            <option value="OccupationalHealthcare">Occupational Healthcare</option>
            <option value="Hospital">Hospital</option>
          </select>
       </label>

        {type === 'HealthCheck' && (
        <div>
          <label>
            Health Check Rating:
            <select value={healthCheckRating} onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}>
              <option value={HealthCheckRating.Healthy}>Healthy</option>
              <option value={HealthCheckRating.LowRisk}>Low Risk</option>
              <option value={HealthCheckRating.HighRisk}>High Risk</option>
              <option value={HealthCheckRating.CriticalRisk}>Critical Risk</option>
            </select>
          </label>
        </div>
        )}
        {type === 'OccupationalHealthcare' && (
          <div>
            <label>
              Employer Name:
              <input type="text" value={employerName} onChange={(e) => setEmployerName(e.target.value)} required />
            </label>
          </div>
        )}

        {type === 'Hospital' && (
          <div>
            <label>
              Diagnosis Codes:
              <input type="text" value={diagnosisCodes} onChange={(e) => setDiagnosisCodes(e.target.value)} />
            </label>
            <label>
              Discharge Date:
              <input type="date" value={discharge.date} onChange={(e) => setDischarge({ ...discharge, date: e.target.value })} />
            </label>
            <label>
              Discharge Criteria:
              <input type="text" value={discharge.criteria} onChange={(e) => setDischarge({ ...discharge, criteria: e.target.value })} />
            </label>
          </div>
        )}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;