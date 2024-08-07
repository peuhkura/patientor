import { useState, useEffect } from "react";
import { Divider, Typography, Box, Grid, Button } from '@mui/material';
import { EntryFormValues, Patient, Gender, Entry, Diagnosis } from "../../types";
import { apiBaseUrl } from "../../constants";
import React from 'react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ConstructionIcon from '@mui/icons-material/Construction';
import AddEntryModal from "../AddEntryModal";
import axios from 'axios';
import patientService from "../../services/patients";

interface Props {
  patientId: string;
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const ShowPatient = ({ patientId="{patientId}", onCancel }: Props) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [ssn, setSsn] = useState<string>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(Gender.Other);
  const initialDiagnoses: Diagnosis[] = [];
  const [diagnoses, setDiagnoses] = useState(initialDiagnoses);
  const initialEntries: Entry[] = [];
  const [entriesData, setEntriesData] = useState(initialEntries);
  const [fetchTrigger, setFetchTrigger] = useState(0); // State to trigger re-fetch
  const [addEntryModalOpen, setAddEntryModalOpen] = useState<boolean>(false);
  const openModal = (): void => {
    setAddEntryModalOpen(true);
  };
  const closeModal = (): void => {
    setAddEntryModalOpen(false);
  };
  const [error, setError] = useState<string>();
    
  const refetchPatientData = () => {
    setFetchTrigger((prev) => prev + 1); // Increment fetchTrigger to re-trigger useEffect
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      setError('');
      const patient = await patientService.createEntry(patientId, values);
      //setPatients(patients.concat(patient));
      if (patient !== undefined){
        console.error("Patient undefined error");
      }
      setAddEntryModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.log("ERROR");
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError(e.message);
      }
      setError(e.response.json());
    }
    refetchPatientData();
};

  useEffect(() => {
    const fetchDiagnoses  = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/diagnoses`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Diagnosis[] = await response.json();
        console.log(JSON.stringify(data));
        setDiagnoses(JSON.parse(JSON.stringify(data)));
      } catch (error: unknown) {
        console.log(error);
        
        if (axios.isAxiosError(error)) {
          // Handle AxiosError
          if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error);
          } else {
            setError('An unexpected error occurred');
          }
        } else if (error instanceof Error) {
          // Handle general Error
          setError(error.message);
        } else {
          // Handle unknown error
          setError('An unknown error occurred');
        }
      }
    };

    const fetchPatientData = async () => {
      try {
        //setLoading(true);
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
        setEntriesData(JSON.parse(JSON.stringify(data[0].entries)));

        console.log("show patient useEffect.");

        if (addEntryModalOpen) {
          // show error related to entry
        } else {
          setError('');
        }
      } catch (error: unknown) {
        //console.log(error);
        //setError(error);

        if (axios.isAxiosError(error)) {
          // Handle AxiosError
          if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error);
          } else {
            setError('An unexpected error occurred');
          }
        } else if (error instanceof Error) {
          // Handle general Error
          setError(error.message);
        } else {
          // Handle unknown error
          setError('An unknown error occurred');
        }
      }
    };

    fetchDiagnoses();
    fetchPatientData();
  }, [patientId, fetchTrigger, addEntryModalOpen]);

  const EntryDetails: React.FC<{ entry: Entry; diagnosisCodes: string[]; diagnoses: Diagnosis[] }> 
    = ({ entry, diagnosisCodes, diagnoses }) => {
    
    const renderIcon = (entry: Entry) => {
      switch (entry.type) {
        case 'HealthCheck':
          return (
            <MonitorHeartIcon/>
          );
        case 'OccupationalHealthcare':
          return (
            <ConstructionIcon/>
          );
        case 'Hospital':
          return (
            entry.discharge !== undefined && (
              <LocalHospitalIcon/>
            )
          );
        default:
          return null;
      }
    };

    const renderEntrySpecificDetails = (entry: Entry) => {
      switch (entry.type) {
        case 'HealthCheck':
          return (
            entry.healthCheckRating !== undefined && (
              <Typography variant="body2">Health Check Rating: {entry.healthCheckRating}</Typography>
            )
          );
        case 'OccupationalHealthcare':
          return (
            entry.employerName !== undefined && (
              <Typography variant="body2">Employer Name: {entry.employerName}</Typography>
            )
          );
        case 'Hospital':
          return (
            entry.discharge !== undefined && (
              <Typography variant="body2">Discharge: {entry.discharge.date}, {entry.discharge.criteria}</Typography>
            )
          );
        default:
          return null;
      }
    };

    const renderEntryDiagnosis = (diagnosisCodes: string[], diagnoses: Diagnosis[]) => {
      // Check if diagnosisCodes is empty
      if (!diagnosisCodes || diagnosisCodes.length === 0) {
        return (
          <div>
            <Typography variant="body2"><strong>Diagnoses</strong></Typography>
            <Typography variant="body2">No diagnoses available</Typography>
          </div>
        );
      }
        
      // Check if diagnoses is defined and not null
      if (!diagnoses || !Array.isArray(diagnoses)) {
        return (
          <div>
            <Typography variant="body2"><strong>Diagnoses</strong></Typography>
            <Typography variant="body2">No diagnoses data available</Typography>
          </div>
        );
      }
      
      // Generate list of diagnosis codes and names based on codes
      const diagnosisList = diagnosisCodes.map(code => {
        const diagnosis = diagnoses.find(d => d.code === code);
        return diagnosis ? (
          <Typography key={code} variant="body2">{code}: {diagnosis.name}</Typography>
        ) : (
          <Typography key={code} variant="body2">???</Typography>
        );
      });

      return (
        <div>
          <br/><Typography variant="body2"><strong>Diagnoses</strong></Typography>
          {diagnosisList}
        </div>
      );
    };

    return (
      <div className="entry">
        <Box component="section" sx={{ p: 2, border: '1px solid grey' }}>
          {renderIcon(entry)}
          <Typography variant="body2"><strong>Date: {entry.date}</strong></Typography>
          <Typography variant="body2">Specialist: {entry.specialist}</Typography>
          <Typography variant="body2">Description: {entry.description}</Typography>
          {renderEntrySpecificDetails(entry)}
          {(entry.diagnosisCodes !== undefined && entry.diagnosisCodes !== '') ? renderEntryDiagnosis(diagnosisCodes, diagnoses) : ''}

        </Box>
      </div>
    );
  };


  return (
    <div>
      <Typography variant="body1">Name: {name}</Typography>
      <Typography variant="body1">SSN: {ssn}</Typography>
      <Typography variant="body1">Date of birth: {dateOfBirth}</Typography>
      <Typography variant="body1">Occupation: {occupation}</Typography>
      <Typography variant="body1">Gender: {gender}</Typography>
      <Divider></Divider>

      <Typography variant="body1"><strong>Entries:</strong></Typography>
      {entriesData.map(entry => (
        <EntryDetails key={entry.id} entry={entry} diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnoses} />
      ))}

      <AddEntryModal
        modalOpen={addEntryModalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />

      <Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            style={{ float: "left", marginTop: 20 }}
            type="button"
            onClick={() => openModal()}
          >
            New Entry
          </Button>   
          <Button
            color="primary"
            variant="contained"
            style={{ float: "right", marginTop: 20 }}
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