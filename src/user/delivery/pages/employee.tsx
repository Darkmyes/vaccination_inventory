import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, Card, IconButton, CardContent, InputLabel, FormControl, AlertColor, CardHeader, Divider, Grid, FormHelperText, FormControlLabel, Checkbox } from "@mui/material";
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { EmployeeUserUC } from '../../usecase/employee_usecase';
import { AuthUserUC } from '../../usecase/auth_usecase';
import { User } from '../../../domain/user';
import { Badge, Email, LocationCityRounded, Phone, Save, Event, TextFields, Delete, Add } from '@mui/icons-material';
import TopSnackbar from '../../../components/top_snackbar';
import MainLayout from '../../../layouts/main_layout';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { VaccineHistory } from '../../../domain/vaccine_history';
import ModalVaccinationAdd from '../components/modal_vaccination_add';
import ModalVaccinationDelete from '../components/modal_vaccination_delete';
import { UserValidator } from '../../usecase/validator';

const userRepo = new UserFakeAPIRepo();
const authUserUC = new AuthUserUC(userRepo);
const employeeUserUC = new EmployeeUserUC(userRepo);

interface ValidationErrors {
    ci: string[];
    name: string[];
    lastname: string[];
    email: string[];
    birthDate: string[];
    phoneNumber: string[];
    homeAddress: string[];
}

const EmployeePage = () => {
    const [addModalVisibility, setAddModalVisibility] = React.useState<boolean>(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState<boolean>(false);

    const defaultRoleId = 2;
    const [userFormData, setUserFormData] = React.useState<User>(
        new User("", "", "", "", defaultRoleId)
    );
    const handleChange = (prop: keyof User) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (prop === 'phoneNumber' && !(/^[0-9]+$/).test(event.target.value) && event.target.value !== "") {
            setUserFormData({ ...userFormData });
            return
        }

        if (prop === 'vaccineState') {
            if (userFormData.vaccineHistory.length > 0) {
                setUserFormData({ ...userFormData });
                return
            }
            setUserFormData({ ...userFormData, [prop]: !userFormData.vaccineState });
            return
        }

        setUserFormData({ ...userFormData, [prop]: event.target.value });
    };

    const vaccineHistoryColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'dosisNumber', headerName: '# Dosis', width: 70 },
        { field: 'vaccine', valueGetter: (params) => { return params.row.vaccine != null ? params.row.vaccine.name : "-" } , headerName: 'Vaccine', width: 130 },
        { field: 'vaccinationDate', headerName: 'Date', width: 130 },
    ];

    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>("error");
    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);

    const [validationErrors, setValidationErrors] = React.useState<ValidationErrors>({
        ci: [],
        name: [],
        lastname: [],
        email: [],
        birthDate: [],
        phoneNumber: [],
        homeAddress: []
    });

    const [vaccinesSelected, setVaccinesSelected] = React.useState<VaccineHistory[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const openDeleteModal = () => {
        let usersSelectedInTable = vaccinesSelected.filter( vaccineInArray => selectionModel.includes(vaccineInArray.id) )
        setVaccinesSelected(JSON.parse(JSON.stringify(usersSelectedInTable)))

        setDeleteModalVisibility(true)
    }

    const validateUserForErrors = () => {
        const ciErrors = UserValidator.validateCI(userFormData.ci)
        const nameErrors = UserValidator.validateName(userFormData.name)
        const lastnameErrors = UserValidator.validateLastname(userFormData.lastname)
        const emailErrors = UserValidator.validateEmail(userFormData.email)

        const birthDateErrors = UserValidator.validateBirthDate(userFormData.birthDate)
        const phoneNumberErrors = UserValidator.validatePhoneNumber(userFormData.phoneNumber)
        const homeAdressErrors = UserValidator.validateHomeAddress(userFormData.homeAddress)

        setValidationErrors({
            ci: ciErrors,
            name: nameErrors,
            lastname: lastnameErrors,
            email: emailErrors,

            birthDate: birthDateErrors,
            phoneNumber: phoneNumberErrors,
            homeAddress: homeAdressErrors
        })

        let errors: string[] = [];

        errors = errors.concat(ciErrors);
        errors = errors.concat(nameErrors);
        errors = errors.concat(lastnameErrors);
        errors = errors.concat(emailErrors);

        errors = errors.concat(birthDateErrors);
        errors = errors.concat(phoneNumberErrors);
        errors = errors.concat(homeAdressErrors);

        return  errors
    }

    const handleAddVaccineHistory = (vaccineHistory: VaccineHistory) => {
        let maxId: number = 0;
        if (userFormData.vaccineHistory.length > 0) {
            maxId = userFormData.vaccineHistory.reduce((vaccineHistoryInArray, maxIdVaccineHistory) => {
                return vaccineHistory.id > maxIdVaccineHistory.id ? vaccineHistoryInArray : maxIdVaccineHistory;
            }, userFormData.vaccineHistory[0]).id;
        }
        vaccineHistory.id = maxId + 1

        let vaccineHistoryArray = JSON.parse(JSON.stringify(userFormData.vaccineHistory))
        vaccineHistoryArray.push(vaccineHistory)
        setUserFormData({ ...userFormData, vaccineHistory: vaccineHistoryArray });
    }

    const handleDeleteVaccineHistory = () => {
        let vaccineHistoryArray = JSON.parse(JSON.stringify(userFormData.vaccineHistory))
        vaccineHistoryArray = vaccineHistoryArray.filter((vaccine: VaccineHistory) => !selectionModel.includes(vaccine.id))
        setUserFormData({ ...userFormData, vaccineHistory: vaccineHistoryArray });
        setSelectionModel([]);
    }

    const handleSaveButton = async () => {
        const validationErrorMessages = validateUserForErrors()
        if (validationErrorMessages.length > 0) {
            let validationError = "Error in User data:\n"
            validationErrorMessages.forEach( errorMessage => validationError += (errorMessage + ".\n"))
            setSnackbarMessage(validationError)
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
            return
        }

        try {
            let userToUpdate = JSON.parse(JSON.stringify(userFormData)) as User;

            const newUser = await employeeUserUC.update(userToUpdate);
            if (newUser === null) {
                setSnackbarMessage("Failed to update: Internal Error")
                setSnackbarSeverity("error")
                setSnackbarVisibility(true)
                return
            }
            setSnackbarMessage("User updated succesfully")
            setSnackbarSeverity("success")
            setSnackbarVisibility(true)
        } catch ( error ) {
            console.log(error)
            setSnackbarMessage("Failed to update: Internal Error")
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
        }
    }

    React.useEffect(() => {
        authUserUC.getUserByToken()
            .then(user => {
                if (user !== null && user !== undefined) {
                    setUserFormData(user as User)
                }
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <MainLayout>

            <ModalVaccinationAdd
                visibility={addModalVisibility}
                handleVisibility={setAddModalVisibility}
                handleFinishAction={handleAddVaccineHistory}
            ></ModalVaccinationAdd>

            <ModalVaccinationDelete
                visibility={deleteModalVisibility}
                handleVisibility={setDeleteModalVisibility}
                vaccineHistories={userFormData.vaccineHistory}
                handleFinishAction={handleDeleteVaccineHistory}
            ></ModalVaccinationDelete>

            <TopSnackbar
                message={snackbarMessage}
                visibility={snackbarVisibility}
                severity={snackbarSeverity}
                handleVisibility={setSnackbarVisibility}
            />

            <div style={{ minHeight: "400px", height: 400, width: '100%' }}>
                <Card
                    sx={{
                        mt: 5,
                        minWidth: '275px'
                    }}
                >
                    <CardHeader
                        title="User Data"
                        action={
                            <IconButton color="success" onClick={ handleSaveButton }>
                                <Save></Save>
                            </IconButton>
                        }
                    />
                    <Divider />
                    <CardContent className='flex column items-center'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-ci">CI</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-ci"
                                        type="text"
                                        value={userFormData.ci}
                                        onChange={handleChange('ci')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Badge></Badge>
                                            </InputAdornment>
                                        }
                                        label="CI"
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                                        error={validationErrors.ci.length > 0}
                                    />
                                    {
                                        validationErrors.ci.length === 0 ? <div></div> :
                                        <FormHelperText error id="ci-error">
                                            { validationErrors.ci.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-name"
                                        type="text"
                                        value={userFormData.name}
                                        onChange={handleChange('name')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <TextFields></TextFields>
                                            </InputAdornment>
                                        }
                                        label="Name"
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
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-name">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-lastname"
                                        type="text"
                                        value={userFormData.lastname}
                                        onChange={handleChange('lastname')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <TextFields></TextFields>
                                            </InputAdornment>
                                        }
                                        label="Last Name"
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
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-name">Email</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-email"
                                        type="text"
                                        value={userFormData.email}
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
                            </Grid>

                            <Grid item xs={12}>
                                <Divider variant="middle"></Divider>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-birthdate">Birth Date</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-birthdate"
                                        type="date"
                                        value={userFormData.birthDate}
                                        onChange={handleChange('birthDate')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Event></Event>
                                            </InputAdornment>
                                        }
                                        label="Birth Date"
                                        error={validationErrors.birthDate.length > 0}
                                    />
                                    {
                                        validationErrors.birthDate.length === 0 ? <div></div> :
                                        <FormHelperText error id="birth-date-error">
                                            { validationErrors.birthDate.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-phone-number">Phone Number</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-phone-number"
                                        type="text"
                                        value={userFormData.phoneNumber}
                                        onChange={handleChange('phoneNumber')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Phone></Phone>
                                            </InputAdornment>
                                        }
                                        label="Phone Number"
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 }}
                                        error={validationErrors.phoneNumber.length > 0}
                                    />
                                    {
                                        validationErrors.phoneNumber.length === 0 ? <div></div> :
                                        <FormHelperText error id="phone-number-error">
                                            { validationErrors.phoneNumber.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-home-address">Home Address</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-home-address"
                                        type="text"
                                        value={userFormData.homeAddress}
                                        onChange={handleChange('homeAddress')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <LocationCityRounded></LocationCityRounded>
                                            </InputAdornment>
                                        }
                                        label="Home Address"
                                        error={validationErrors.homeAddress.length > 0}
                                    />
                                    {
                                        validationErrors.homeAddress.length === 0 ? <div></div> :
                                        <FormHelperText error id="home-address-error">
                                            { validationErrors.homeAddress.reduce((error, currentError) => {
                                                return currentError + (". " + error)
                                            }, "") }
                                        </FormHelperText>
                                    }
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormControlLabel
                                        control={<Checkbox
                                            checked={userFormData.vaccineState}
                                            onChange={handleChange('vaccineState')}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />}
                                        label="Vaccination State"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} className="flex justify-between items-center no-wrap">
                                <h2>Vaccination History</h2>
                                <div className='flex items-center justify-end wrap'>
                                    <Button
                                        sx={{ m: 1 }}
                                        variant="contained"
                                        color='success'
                                        onClick={() => setAddModalVisibility(true)}
                                        startIcon={<Add />}
                                    >
                                        Add
                                    </Button>
                                    {/* <Button
                                        sx={{ m: 1 }}
                                        variant="contained"
                                        color='warning'
                                        onClick={openEditModal}
                                        startIcon={<Edit />}
                                        disabled={selectionModel.length !== 1}
                                    >
                                        Edit
                                    </Button> */}
                                    <Button
                                        sx={{ m: 1 }}
                                        variant="contained"
                                        color='error'
                                        onClick={openDeleteModal}
                                        startIcon={<Delete />}
                                        disabled={selectionModel.length === 0}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Grid>
                            {
                                !userFormData.vaccineState ? <div></div> : 
                                <Grid item xs={12} style={{ minHeight: "300px", height: 300 }}>
                                    <DataGrid
                                        rows={userFormData.vaccineHistory}
                                        columns={vaccineHistoryColumns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        checkboxSelection
                                        selectionModel={selectionModel}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            setSelectionModel(newSelectionModel);
                                        }}
                                    />
                                </Grid>
                            }
                        </Grid>
                    </CardContent>
                </Card>
            </div>

        </MainLayout>
    )
}

export default EmployeePage