import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import ShowPatient from "./ShowPatient";
import { PatientFormValues } from "../../types";

interface Props {
  patientId: string;
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => void;
  error?: string;
}

const ShowPatientModal = ({ patientId, modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Show patient {patientId}</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error"></Alert>}
      <ShowPatient patientId={patientId} onSubmit={onSubmit} onCancel={onClose}/>
    </DialogContent>
  </Dialog>
);

export default ShowPatientModal;
