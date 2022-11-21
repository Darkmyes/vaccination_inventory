import * as React from 'react';
import { Button, Card, IconButton, CardContent, Modal, CardActions, CardHeader, Divider, Grid } from "@mui/material";
import { VaccineHistory } from '../../../domain/vaccine_history';
import { Close } from '@mui/icons-material';
interface ModalVaccinationDeleteProps {
    visibility: boolean;
    handleVisibility: Function;
    vaccineHistories: VaccineHistory[];
    handleFinishAction: Function;
}

const ModalVaccinationDelete : React.FC<ModalVaccinationDeleteProps> = (props) => {
    const handleDeleteButton = async () => {
        props.handleFinishAction();
        props.handleVisibility(false);
    }

    return (
        <div>
            <Modal
                open={props.visibility}
                onClose={() => props.handleVisibility(false)}
            >
                <Card
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: '275px'
                    }}
                >
                    <CardHeader
                        action={
                            <IconButton onClick={() => props.handleVisibility(false) }>
                                <Close></Close>
                            </IconButton>
                        }
                        title="Register VaccineHistory"
                    />
                    <Divider />
                    <CardContent className='flex column items-center'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className="text-center">
                                Are you sure of deleting the folowing Vaccines dosis records?<br /><br />
                                {
                                    props.vaccineHistories === null ? <div></div>: 
                                    props.vaccineHistories.map( vaccinehistory => <div key={vaccinehistory.id}>
                                        <b>Dosis { vaccinehistory.dosisNumber }:</b> { vaccinehistory.vaccine?.name }  <br />
                                    </div>)
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions className='justify-end'>
                        <Button
                            color='error'
                            onClick={() => props.handleVisibility(false) }
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color='error'
                            onClick={handleDeleteButton}
                        >
                            Eliminar
                        </Button>
                    </CardActions>
                </Card>
            </Modal>
        </div>
        
    )
}

export default ModalVaccinationDelete