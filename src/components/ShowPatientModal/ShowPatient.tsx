import { useState, useEffect } from "react";
import { Container, List, ListItem, ListItemText, Divider, Typography, Box, Grid, Button } from '@mui/material';
import { PatientFormValues, Patient, Gender, Entry, Diagnosis } from "../../types";
import { apiBaseUrl } from "../../constants";
import React from 'react';

interface Props {
  patientId: string;
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

const ShowPatient = ({ patientId="{patientId}", onCancel }: Props) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [ssn, setSsn] = useState<string>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(Gender.Other);
  //const [loading, setLoading] = useState<boolean>(true);
  //const [data, setData] = useState<Patient | null>(null);
  //const [error, setError] = useState<string | null>(null);
  const initialDiagnosis: Diagnosis[] = [];
  const [diagnosis, setDiagnosis] = useState(initialDiagnosis);
  const initialEntries: Entry[] = [];
  const [entriesData, setEntriesData] = useState(initialEntries);

  // For test
  /*const diagnosisCodes: string[] = ['Z57.1', 'Z74.3', 'M51.2'];
  const diagnoses2: Diagnosis[] = [
    { code: "M24.2", name: "Disorder of ligament", latin: "Morbositas ligamenti" },
    { code: "M51.2", name: "Other specified intervertebral disc displacement", latin: "Alia dislocatio disci intervertebralis specificata" },
    { code: "S03.5", name: "Sprain and strain of joints and ligaments of other and unspecified parts of head", latin: "Distorsio et/sive distensio articulationum et/sive ligamentorum partium aliarum sive non specificatarum capitis" },
  ];*/
  //let diagnoses: Diagnosis[];



  useEffect(() => {
    const fetchDiagnoses  = async () => {
      try {
        //setLoading(true);
        const response = await fetch(`${apiBaseUrl}/diagnoses`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Diagnosis[] = await response.json();

        console.log(JSON.stringify(data));
        setDiagnosis(JSON.parse(JSON.stringify(data)));
      } catch (error: any) {
        //setError(error.message);
        console.log(error);
      } finally {
        //setLoading(false);
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
        //console.log(entriesData);
      } catch (error: any) {
        //setError(error.message);
        console.log(error);
      } finally {
        //setLoading(false);
      }
    };
    
    fetchDiagnoses();
    fetchPatientData();
  }, [patientId]);

  interface DiagnosisListProps {
    codes: string[];
    diagnoses: Diagnosis[];
  }

  const DiagnosisList: React.FC<DiagnosisListProps> = ({ codes, diagnoses }) => {
    return (
      <Container>
        <br/>
        <Typography variant="body2"><strong>Diagnosis List:</strong></Typography>
        <List>
          {codes.map(code => {
            const matchingDiagnosis = diagnoses.find(diagnosis => diagnosis.code === code);
            return (
                <ListItem alignItems="flex-start" sx={{ padding: '4px 0' }}>
                  {matchingDiagnosis ? (
                    <ListItemText variant="body2" sx={{ display: 'block' }} 
                      primary={`Code: ${matchingDiagnosis.code}, ${matchingDiagnosis.name}`}
                    />
                  ) : (
                    <ListItemText primary={`No matching diagnosis found for code: ${code}`} />
                  )}
                </ListItem>
            );
          })}
        </List>
      </Container>
    );
  };

//   const Entry = ({ entry, diagnosisCodes, diagnoses }) => (
  interface EntryProps {
    entry: Entry;
    diagnosisCodes: string[];
    diagnoses: Diagnosis[];
  }

  const Entry: React.FC<EntryProps> =({ entry, diagnosisCodes, diagnoses }) => (

    <div className="entry">

    <Box p={1}>
      <Typography variant="body2"><strong>Date: {entry.date}</strong></Typography>
      <Typography variant="body2">Specialist: {entry.specialist}</Typography>
      <Typography variant="body2">Description: {entry.description}</Typography>
      {entry.healthCheckRating !== undefined && (
        <Typography variant="body2">Health Check Rating: {entry.healthCheckRating}</Typography>
      )}
      {entry.employerName && (
        <Typography variant="body2">Employer Name: {entry.employerName}</Typography>
      )}
      {entry.discharge && (
        <Typography variant="body2">Discharge: {entry.discharge.date}, {entry.discharge.criteria}</Typography>
      )}
      {diagnosisCodes && (<DiagnosisList codes={diagnosisCodes} diagnoses={diagnoses} />)}
    </Box>

    </div>
  );

  /* Snippets
      {diagnosisCodes && (
        <Typography variant="body2">Diagnose codes: {diagnosisCodes}</Typography>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>MORO:{JSON.stringify(entriesData, null, 2)}</pre>
      <pre>{JSON.stringify(diagnosisData, null, 2)}</pre>
    */

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
        <Entry key={entry.id} entry={entry} diagnosisCodes={entry.diagnosisCodes} diagnoses={diagnosis} />
      ))}

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