import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, Card, IconButton, CardContent, InputLabel, FormControl, Snackbar, Slide, Alert, Modal, CircularProgress, CardActions, Typography, CardHeader, Divider, Select, MenuItem, SelectChangeEvent, Grid } from "@mui/material";
import { RolFakeAPIRepo } from '../../../rol/repository/fake_api';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { User } from '../../../domain/user';
import { Rol } from '../../../domain/rol';
import { Badge, Close, Email, SupervisedUserCircle, TextFields } from '@mui/icons-material';
import { minWidth } from '@mui/system';

const rolRepo = new RolFakeAPIRepo();

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);
interface ModalAddProps {
    visibility: boolean;
    handleVisibility: Function;
}

const ModalAdd : React.FC<ModalAddProps> = (props) => {
    const defaultRoleId = 2;
    const [userFormData, setUserFormData] = React.useState<User>(
        new User("", "", "", "", defaultRoleId)
    );
    const handleChange = (prop: keyof User) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({ ...userFormData, [prop]: event.target.value });
    };

    const handleChangeSelect = (prop: keyof User) => (event: SelectChangeEvent) => {
        setUserFormData({ ...userFormData, [prop]: event.target.value });
    };

    const handleRegisterButton = () => {
        try {
            const newUser = adminUserUC.register(userFormData);
            if (newUser === null) {
                console.log("error")
                // notificar por snackbar
            }
        } catch ( error ) {
            console.log(error)
            // notificar por snackbar
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
                {/* <CardContent className='flex column items-center'>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-ci">CI</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-ci"
                            type="number"
                            value={userFormData.ci}
                            onChange={handleChange('ci')}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Badge></Badge>
                                </InputAdornment>
                            }
                            label="CI"
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
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
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
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
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
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
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
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
                                roles.map(rol => <MenuItem value={rol.id}>{rol.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </CardContent> */}
                <CardContent className='flex column items-center'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-ci">CI</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-ci"
                                    type="number"
                                    value={userFormData.ci}
                                    onChange={handleChange('ci')}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Badge></Badge>
                                        </InputAdornment>
                                    }
                                    label="CI"
                                />
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
                                        roles.map(rol => <MenuItem value={rol.id}>{rol.name}</MenuItem>)
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
                                />
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
                                />
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
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions className='justify-end'>
                    <Button
                        color='error'
                        size="small"
                        onClick={() => props.handleVisibility(false) }
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color='success'
                    >
                        Register
                    </Button>
                </CardActions>
            </Card>
        </Modal>
    )
}

export default ModalAdd