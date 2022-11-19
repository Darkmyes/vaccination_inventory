import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, IconButton, Card, CardContent, InputLabel, FormControl, Snackbar, Slide, Alert, Modal, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../../../layouts/main_layout';
import { Person, Lock } from '@mui/icons-material';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { Box } from '@mui/system';
import { User } from '../../../domain/user';

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);

interface AdminState {
    username: string,
    password: string,
    showPassword: boolean
}

function TransitionDown(props: any) {
    return <Slide {...props} direction="down" />;
}

const AdminPage = () => {
    const navigate = useNavigate()

    const [values, setValues] = React.useState<AdminState>({
        username: "",
        password: "",
        showPassword: false
    });
    const handleChange = (prop: keyof AdminState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);
    const handleCloseSnackbar = () => {
        setSnackbarVisibility(false);
    };

    const [loaderModalVisibility, setLoaderModalVisibility] = React.useState<boolean>(false);

    const userColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'lastname', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'username', headerName: 'Username', width: 130 },
    ];
    const [users, setUsers] = React.useState<User[]>([]);

    const getUsers = async() => {
        const users = await adminUserUC.list();
        setUsers(users);
    }

    const getAdmins = async() => {
        const users = await adminUserUC.listAdmins();
        setUsers(users);
    }

    const getEmployees = async() => {
        const users = await adminUserUC.listEmployees();
        setUsers(users);
    }

    React.useEffect( () => {
        getUsers();
    })

    return (
        <MainLayout>
            <div className='flex items-center justify-between'>
                <h1>Users</h1>
                <div className='flex items-center justify-between'>
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='success'
                    >
                        Add
                    </Button>
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='warning'
                    >
                        Edit
                    </Button>
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='error'
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <div style={{ minHeight: "400px", height: 400, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={userColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>

            {/* <Card>
                <CardContent className='flex column items-center'>
                    <div className='p-xs text-center'>
                        <h1>Vaccination Inventory</h1>
                    </div>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-username"
                            type="text"
                            value={values.username}
                            onChange={handleChange('username')}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Person></Person>
                                </InputAdornment>
                            }
                            label="Username"
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Lock></Lock>
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1 }}>
                        <Button
                            variant="contained"
                            color='success'
                        >
                            Admin
                        </Button>
                    </FormControl>
                </CardContent>
            </Card> */}

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbarVisibility}
                onClose={handleCloseSnackbar}
                autoHideDuration={2000}
                key="topCenterSnackbar"
                TransitionComponent={TransitionDown}
            >
                <Alert severity="error">Error: Wrong username or password"!</Alert>
            </Snackbar>

            <Modal
                open={loaderModalVisibility}
                >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <CircularProgress variant="indeterminate" sx={{ color: "white" }}/>
                </Box>
            </Modal>
        </MainLayout>
    )
}

export default AdminPage