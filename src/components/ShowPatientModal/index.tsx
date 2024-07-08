import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import ShowPatient from "./ShowPatient";
import { EntryFormValues } from "../../types";

interface Props {
  patientId: string;
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const ShowPatientModal = ({ patientId, modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle><b>Show Patient</b> ({patientId})</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error"></Alert>}
      <ShowPatient patientId={patientId} onSubmit={onSubmit} onCancel={onClose}/>
    </DialogContent>
  </Dialog>
);

export default ShowPatientModal;
