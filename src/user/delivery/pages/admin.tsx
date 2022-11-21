import * as React from 'react';
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';

import MainLayout from '../../../layouts/main_layout';
import { Delete, Edit, Add } from '@mui/icons-material';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { User } from '../../../domain/user';
import ModalAdd from '../components/modal_add';
import ModalDelete from '../components/modal_delete';

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);

const AdminPage = () => {
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

    const [userSelected, setUserSelected] = React.useState<User | null>(null);
    const [usersSelected, setUsersSelected] = React.useState<User[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const openEditModal = () => {
        let usersSelected = users.find( userInArray => selectionModel.includes(userInArray.id) )        
        setUsersSelected(JSON.parse(JSON.stringify(usersSelected)))

        setEditModalVisibility(true)
    }

    const openDeleteModal = () => {
        let userSelected = users.find( userInArray => userInArray.id === selectionModel[0] )        
        setUserSelected(JSON.parse(JSON.stringify(userSelected)))

        setDeleteModalVisibility(true)
    }

    /* const getAdmins = async() => {
        const users = await adminUserUC.listAdmins();
        setUsers(users);
    }

    const getEmployees = async() => {
        const users = await adminUserUC.listEmployees();
        setUsers(users);
    } */

    React.useEffect( () => {
        getUsers();
    }, [])

    return (
        <MainLayout>

            <ModalAdd
                visibility={addModalVisibility}
                handleVisibility={setAddModalVisibility}
                handleFinishAction={getUsers}
            ></ModalAdd>

            {/* {
                selectionModel.length !== 1 ? <div></div> : 
                <ModalEdit
                    visibility={editModalVisibility}
                    handleVisibility={setEditModalVisibility}
                    handleFinishAction={getUsers}
                    user={userSelected}
                ></ModalEdit>
            } */}

            {
                userSelected === null ? <div></div> : 
                <ModalDelete
                    visibility={deleteModalVisibility}
                    handleVisibility={setDeleteModalVisibility}
                    handleFinishAction={getUsers}
                    users={usersSelected}
                ></ModalDelete>
            }

            <div className='flex items-center justify-between'>
                <h1>Users</h1>
                <div className='flex items-center justify-between'>
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='success'
                        onClick={() => setAddModalVisibility(true)}
                        startIcon={<Add />}
                    >
                        Add
                    </Button>
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='warning'
                        onClick={() => setEditModalVisibility(true)}
                        startIcon={<Edit />}
                    >
                        Edit
                    </Button>
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='error'
                        onClick={openDeleteModal}
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
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                />
            </div>
        </MainLayout>
    )
}

export default AdminPage