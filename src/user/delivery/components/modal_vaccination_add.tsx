import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, Card, IconButton, CardContent, InputLabel, FormControl, AlertColor, Modal, CardActions, CardHeader, Divider, Select, MenuItem, SelectChangeEvent, Grid, FormHelperText } from "@mui/material";
import { VaccineFakeAPIRepo } from '../../../vaccine/repository/fake_api';
import { VaccineHistory } from '../../../domain/vaccine_history';
import { Vaccine } from '../../../domain/vaccine';
import { Category, Close, Event, Numbers } from '@mui/icons-material';
import TopSnackbar from '../../../components/top_snackbar';
import { UserValidator } from '../../usecase/validator';

const vaccineRepo = new VaccineFakeAPIRepo();

interface ModalVaccinationAddProps {
    visibility: boolean;
    handleVisibility: Function;
    handleFinishAction: Function;
}

interface ValidationErrors {
    vaccinationDate: string[];
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
        setVaccineHistoryFormData({ ...vaccinehistoryFormData, [prop]: event.target.value, vaccine: vaccine });
    };

    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>("error");
    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);

    const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({
        vaccinationDate: []
    });

    const validateVaccineHistoryForErrors = () => {
        const dateErrors = UserValidator.validateDate(vaccinehistoryFormData.vaccinationDate)

        setValidationErrors({
            vaccinationDate: dateErrors,
        })

        let errors: string[] = [];
        errors = errors.concat(dateErrors);

        return errors
    }

    const handleRegisterButton = async () => {
        let validationErrorMessages = validateVaccineHistoryForErrors()

        if (validationErrorMessages.length > 0) {
            let validationError = "Error in Vaccination Dosis data:\n"
            validationErrorMessages.forEach( errorMessage => validationError += (errorMessage + ".\n"))
            setSnackbarMessage(validationError)
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
            return
        }

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
                setVaccineHistoryFormData({ ...vaccinehistoryFormData, vaccine: vaccines[0] });
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
                        title="Register Vaccine Dosis"
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
                                        /* error={validationErrors.name.length > 0} */
                                    />
                                    {/* {
                                        validationErrors.name.length === 0 ? <div></div> :
                                        <FormHelperText error id="name-error">
                                            { validationErrors.name.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    } */}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-date">Date</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-date"
                                        type="date"
                                        value={vaccinehistoryFormData.vaccinationDate}
                                        onChange={handleChange('vaccinationDate')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Event></Event>
                                            </InputAdornment>
                                        }
                                        label="Date"
                                        error={validationErrors.vaccinationDate.length > 0}
                                    />
                                    {
                                        validationErrors.vaccinationDate.length === 0 ? <div></div> :
                                        <FormHelperText error id="vaccination-date-error">
                                            { validationErrors.vaccinationDate.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
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