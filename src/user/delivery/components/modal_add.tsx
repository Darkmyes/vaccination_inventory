import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, Card, IconButton, CardContent, InputLabel, FormControl, AlertColor, Modal, CardActions, CardHeader, Divider, Select, MenuItem, SelectChangeEvent, Grid, FormHelperText } from "@mui/material";
import { RolFakeAPIRepo } from '../../../rol/repository/fake_api';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { User } from '../../../domain/user';
import { Rol } from '../../../domain/rol';
import { Badge, Close, Email, SupervisedUserCircle, TextFields } from '@mui/icons-material';
import TopSnackbar from '../../../components/top_snackbar';

const rolRepo = new RolFakeAPIRepo();

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);

interface ModalAddProps {
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

const ModalAdd : React.FC<ModalAddProps> = (props) => {
    const defaultRoleId = 2;
    const [userFormData, setUserFormData] = React.useState<User>(
        new User("", "", "", "", defaultRoleId)
    );
    const handleChange = (prop: keyof User) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (prop === 'ci' && !(/^[0-9]+$/).test(event.target.value) && event.target.value !== "") {
            setUserFormData({ ...userFormData });
            return
        }

        setUserFormData({ ...userFormData, [prop]: event.target.value });
    };
    const handleChangeSelect = (prop: keyof User) => (event: SelectChangeEvent) => {
        setUserFormData({ ...userFormData, [prop]: event.target.value });
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

    const validateUserForErrors = () => {
        const ciErrors = adminUserUC.validateCI(userFormData.ci)
        const nameErrors = adminUserUC.validateName(userFormData.name)
        const lastnameErrors = adminUserUC.validateLastname(userFormData.lastname)
        const emailErrors = adminUserUC.validateEmail(userFormData.email)

        setValidationErrors({
            ci: ciErrors,
            name: nameErrors,
            lastname: lastnameErrors,
            email: emailErrors
        })
    }

    const handleRegisterButton = async () => {
        validateUserForErrors()

        const validationErrorMessages = adminUserUC.validateUser(userFormData)
        if (validationErrorMessages.length > 0) {
            let validationError = "Error in User data:\n"
            validationErrorMessages.forEach( errorMessage => validationError += (errorMessage + ".\n"))
            setSnackbarMessage(validationError)
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
            return
        }

        try {
            let userToRegister = JSON.parse(JSON.stringify(userFormData)) as User;
            const credentials = adminUserUC.generateCredentials(userToRegister);
            userToRegister.username = credentials.username;
            userToRegister.password = credentials.password;

            const newUser = await adminUserUC.register(userToRegister);
            if (newUser === null) {
                setSnackbarMessage("Failed to register: Internal Error")
                setSnackbarSeverity("error")
                setSnackbarVisibility(true)
                return
            }
            setSnackbarMessage("User registered succesfully")
            setSnackbarSeverity("success")
            setSnackbarVisibility(true)

            setUserFormData(new User("", "", "", "", defaultRoleId))
            props.handleVisibility(false)
            props.handleFinishAction()
        } catch ( error ) {
            console.log(error)
            setSnackbarMessage("Failed to register: Internal Error")
            setSnackbarSeverity("error")
            setSnackbarVisibility(true)
        }
    }

    const [roles, setRoles] = React.useState<Rol[]>([]);

    React.useEffect(() => {
        rolRepo.list()
            .then((roles) => {
                setRoles(roles);
            })
            .catch(err => console.log(err))
    }, [])

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
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-rol">Rol</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-rol"
                                        id="demo-simple-rol"
                                        label="Rol"
                                        value={userFormData.rolId.toString()}
                                        onChange={handleChangeSelect('rolId')}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SupervisedUserCircle></SupervisedUserCircle>
                                            </InputAdornment>
                                        }
                                    >
                                        {
                                            roles.map(rol => <MenuItem value={rol.id} key={rol.id}>{rol.name}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
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

export default ModalAdd