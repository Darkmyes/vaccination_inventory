import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, IconButton, Card, CardContent, InputLabel, FormControl, Snackbar, Slide, Alert, Modal, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../../../layouts/main_layout';
import { Person, Lock, Delete, Edit, Add } from '@mui/icons-material';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { Box } from '@mui/system';
import { User } from '../../../domain/user';
import ModalAdd from '../components/modal_add';

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);

const AdminPage = () => {
    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);
    const handleCloseSnackbar = () => {
        setSnackbarVisibility(false);
    };

    const [addModalVisibility, setAddModalVisibility] = React.useState<boolean>(false);
    const [editModalVisibility, setEditModalVisibility] = React.useState<boolean>(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState<boolean>(false);

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
    }, [])

    return (
        <MainLayout>
            <div className='flex items-center justify-between'>
                <h1>Users</h1>
                <div className='flex items-center justify-between'>
                    <Button
                        sx={{ m: 1 }}
                        size="small"
                        variant="contained"
                        color='success'
                        onClick={() => setAddModalVisibility(true)}
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                    <Button
                        sx={{ m: 1 }}
                        size="small"
                        variant="contained"
                        color='warning'
                        startIcon={<Edit />}
                    >
                        Edit
                    </Button>
                    <Button
                        sx={{ m: 1 }}
                        size="small"
                        variant="contained"
                        color='error'
                        startIcon={<Delete />}
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

            <ModalAdd
                visibility={addModalVisibility}
                handleVisibility={setAddModalVisibility}
            ></ModalAdd>
        </MainLayout>
    )
}

export default AdminPage