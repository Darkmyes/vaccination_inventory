import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, IconButton, Card, CardContent, InputLabel, FormControl, Snackbar, Slide, Alert, Modal, CircularProgress, Badge } from "@mui/material";

import { RolFakeAPIRepo } from '../../../rol/repository/fake_api';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { Box } from '@mui/system';
import { User } from '../../../domain/user';
import { Rol } from '../../../domain/rol';
import { Email, TextFields } from '@mui/icons-material';

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
    })

    return (
        <Modal
            open={props.visibility}
            onClose={() => props.handleVisibility(false)}
        >
            <Card>
                <CardContent className='flex column items-center'>
                    <div className='p-xs text-center'>
                        <h1>Vaccination Inventory</h1>
                    </div>
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
                    {/* <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-rol">Rol</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-rol"
                            type="text"
                            value={userFormData.rolId}
                            onChange={handleChange('rolId')}
                            startAdornment={
                                <InputAdornment position="start">
                                    Tt
                                </InputAdornment>
                            }
                            label="Rol"
                        />
                    </FormControl> */}
                    <FormControl sx={{ m: 1 }}>
                        <Button
                            variant="contained"
                            color='error'
                            onClick={() => props.handleVisibility(false) }
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color='success'
                        >
                            Register
                        </Button>
                    </FormControl>
                </CardContent>
            </Card>
        </Modal>
    )
}

export default ModalAdd