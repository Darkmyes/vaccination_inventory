import * as React from 'react';
import { Button, Card, IconButton, CardContent, AlertColor, Modal, CardActions, CardHeader, Divider, Grid } from "@mui/material";
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { User } from '../../../domain/user';
import { Close } from '@mui/icons-material';
import TopSnackbar from '../../../components/top_snackbar';

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);

interface ModalDeleteProps {
    visibility: boolean;
    handleVisibility: Function;
    users: User[];
    handleFinishAction: Function;
}

const ModalDelete : React.FC<ModalDeleteProps> = (props) => {
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>("error");
    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);

    const handleDeleteButton = async () => {
        let deleteRequests = props.users.map(user => adminUserUC.delete(user.id))

        try {
            Promise.all(deleteRequests)
                .then(() => {
                    setSnackbarMessage("User deleted succesfully")
                    setSnackbarSeverity("success")
                    setSnackbarVisibility(true)

                    props.handleVisibility(false)
                    props.handleFinishAction()
                })
                .catch(() => {
                    setSnackbarMessage("Failed to delete: Internal Error")
                    setSnackbarSeverity("error")
                    setSnackbarVisibility(true)
                })
        } catch ( error ) {
            console.log(error)
            setSnackbarMessage("Failed to delete: Internal Error")
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
        }
    }

    return (
        <div>
            <TopSnackbar
                message={snackbarMessage}
                visibility={snackbarVisibility}
                severity={snackbarSeverity}
                handleVisibility={setSnackbarVisibility}
            />

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
                        title="Register User"
                    />
                    <Divider />
                    <CardContent className='flex column items-center'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} className="text-center">
                                Are you sure of deleting the folowing Users?<br></br>
                                {
                                    props.users === null ? <div></div>:
                                    props.users.map( user => <div key={user.id}>
                                        <b>Nombre:</b> { user.name } { user.lastname } <br></br>
                                        <b>CI:</b> { user.ci }
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

export default ModalDelete