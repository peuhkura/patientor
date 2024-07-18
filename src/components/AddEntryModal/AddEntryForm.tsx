import { useState } from "react";
import {  TextField, InputLabel, MenuItem, Select, Grid, Button } from '@mui/material';
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
        <InputLabel style={{ marginTop: 5 }}>Entry Type</InputLabel>
        <Select
          label="Entry Type"
          fullWidth
          value={type}
          onChange={(e) => setType(e.target.value as 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital')}
        >
          <MenuItem key={type} value={"HealthCheck"} >HealthCheck</MenuItem> 
          <MenuItem key={type} value={"OccupationalHealthcare"} >Occupational Healthcare</MenuItem> 
          <MenuItem key={type} value={"Hospital"} >Hospital</MenuItem> 
        </Select>

        {type === 'HealthCheck' && (
        <div>
            <InputLabel style={{ marginTop: 5 }}>Health Check Rating</InputLabel>
            <Select value={healthCheckRating} onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}>
              <MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
              <MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
              <MenuItem value={HealthCheckRating.HighRisk}>High Risk</MenuItem>
              <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk</MenuItem>
            </Select>
        </div>
        )}
        {type === 'OccupationalHealthcare' && (
          <div>
            <TextField
              label="Employer Name:"
              fullWidth 
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />
          </div>
        )}
        {type === 'Hospital' && (
          <div>
            <TextField
              label="Diagnosis Codes:"
              fullWidth 
              value={diagnosisCodes}
              onChange={(e) => setDiagnosisCodes(e.target.value)}
            />
            <TextField
              style={{ marginTop: 10 }}
              label="Discharge Date:"
              fullWidth
              type="date"
              value={discharge.date}
              onChange={(e) => setDischarge({ ...discharge, date: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Discharge Criteria:"
              fullWidth 
              value={discharge.criteria}
              onChange={(e) => setDischarge({ ...discharge, criteria: e.target.value })}
            />

          </div>
        )}
        
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left", marginTop: 20 }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{ float: "right", marginTop: 20 }}
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