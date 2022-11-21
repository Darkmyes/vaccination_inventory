import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, Card, IconButton, CardContent, InputLabel, FormControl, AlertColor, Modal, CardActions, CardHeader, Divider, Select, MenuItem, SelectChangeEvent, Grid, FormHelperText } from "@mui/material";
import { VaccineFakeAPIRepo } from '../../../vaccine/repository/fake_api';
import { VaccineHistory } from '../../../domain/vaccine_history';
import { Vaccine } from '../../../domain/vaccine';
import { Category, Close, Event, Numbers } from '@mui/icons-material';
import TopSnackbar from '../../../components/top_snackbar';

const vaccineRepo = new VaccineFakeAPIRepo();

interface ModalVaccinationAddProps {
    visibility: boolean;
    handleVisibility: Function;
    handleFinishAction: Function;
}

interface ValidationErrors {
    ci: string[];
    name: string[];
    lastname: string[];
    email: string[];
}

const ModalVaccinationAdd : React.FC<ModalVaccinationAddProps> = (props) => {
    const defaultVaccineeId = 1;
    const [vaccinehistoryFormData, setVaccineHistoryFormData] = React.useState<VaccineHistory>(
        new VaccineHistory(defaultVaccineeId, 1, "")
    );
    const handleChange = (prop: keyof VaccineHistory) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setVaccineHistoryFormData({ ...vaccinehistoryFormData, [prop]: event.target.value });
    };
    const handleChangeSelect = (prop: keyof VaccineHistory) => (event: SelectChangeEvent) => {
        let vaccine = vaccines.find(vaccineInArray => vaccineInArray.id === parseInt(event.target.value))
        console.log(vaccine)
        setVaccineHistoryFormData({ ...vaccinehistoryFormData, [prop]: event.target.value, ["vaccine"]: vaccine });
    };

    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>("error");
    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);

    const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({
        ci: [],
        name: [],
        lastname: [],
        email: []
    });

    const validateVaccineHistoryForErrors = () => {
        /* const ciErrors = adminVaccineHistoryUC.validateCI(vaccinehistoryFormData.ci)
        const nameErrors = adminVaccineHistoryUC.validateName(vaccinehistoryFormData.name)
        const lastnameErrors = adminVaccineHistoryUC.validateLastname(vaccinehistoryFormData.lastname)
        const emailErrors = adminVaccineHistoryUC.validateEmail(vaccinehistoryFormData.email) */

        /* setValidationErrors({
            ci: ciErrors,
            name: nameErrors,
            lastname: lastnameErrors,
            email: emailErrors
        }) */
    }

    const handleRegisterButton = async () => {
        validateVaccineHistoryForErrors()

        try {
            let vaccinehistoryToRegister = JSON.parse(JSON.stringify(vaccinehistoryFormData)) as VaccineHistory;

            setVaccineHistoryFormData(new VaccineHistory(defaultVaccineeId, 1, ""))
            props.handleVisibility(false)
            props.handleFinishAction(vaccinehistoryToRegister)
        } catch ( error ) {
            console.log(error)
            setSnackbarMessage("Failed to register: Internal Error")
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
        }
    }

    const [vaccines, setVaccines] = React.useState<Vaccine[]>([]);

    React.useEffect(() => {
        vaccineRepo.list()
            .then((vaccines: Vaccine[]) => {
                setVaccines(vaccines);
                setVaccineHistoryFormData({ ...vaccinehistoryFormData, ["vaccine"]: vaccines[0] });
            })
            .catch((err: string) => {console.log(err)})
    }, [props.visibility])

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
                        title="Register VaccineHistory"
                    />
                    <Divider />
                    <CardContent className='flex column items-center'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-vaccine">Vaccine</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-vaccine"
                                        id="demo-simple-vaccine"
                                        label="Vaccine"
                                        value={vaccinehistoryFormData.vaccineId.toString()}
                                        onChange={handleChangeSelect('vaccineId')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Category></Category>
                                            </InputAdornment>
                                        }
                                    >
                                        {
                                            vaccines.map(vaccine => <MenuItem value={vaccine.id} key={vaccine.id}>{vaccine.name}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-dosis-number">Dosis Number</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-dosis-number"
                                        type="number"
                                        value={vaccinehistoryFormData.dosisNumber}
                                        onChange={handleChange('dosisNumber')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Numbers></Numbers>
                                            </InputAdornment>
                                        }
                                        label="Dosis Number"
                                        inputProps={{ min: 1 }}
                                        error={validationErrors.name.length > 0}
                                    />
                                    {
                                        validationErrors.name.length === 0 ? <div></div> :
                                        <FormHelperText error id="name-error">
                                            { validationErrors.name.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-date">Date</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-date"
                                        type="text"
                                        value={vaccinehistoryFormData.vaccinationDate}
                                        onChange={handleChange('vaccinationDate')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Event></Event>
                                            </InputAdornment>
                                        }
                                        label="Date"
                                        error={validationErrors.lastname.length > 0}
                                    />
                                    {
                                        validationErrors.lastname.length === 0 ? <div></div> :
                                        <FormHelperText error id="lastname-error">
                                            { validationErrors.lastname.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                            {/* <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-name">Email</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email"
                                        type="text"
                                        value={vaccinehistoryFormData.email}
                                        onChange={handleChange('email')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Email></Email>
                                            </InputAdornment>
                                        }
                                        label="Email"
                                        error={validationErrors.email.length > 0}
                                    />
                                    {
                                        validationErrors.email.length === 0 ? <div></div> :
                                        <FormHelperText error id="email-error">
                                            { validationErrors.email.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid> */}
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
                            color='success'
                            onClick={handleRegisterButton}
                        >
                            Register
                        </Button>
                    </CardActions>
                </Card>
            </Modal>
        </div>
        
    )
}

export default ModalVaccinationAdd