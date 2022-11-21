import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridExpandMoreIcon, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';

import MainLayout from '../../../layouts/main_layout';
import { Delete, Edit, Add, Event, FilterAlt, Search, Category, FilterAltOff } from '@mui/icons-material';
import { UserFakeAPIRepo } from '../../repository/fake_api';
import { AdminUserUC } from '../../usecase/admin_usecase';
import { User } from '../../../domain/user';
import ModalAdd from '../components/modal_add';
import ModalDelete from '../components/modal_delete';
import ModalEdit from '../components/modal_edit';
import { VaccineHistory } from '../../../domain/vaccine_history';
import { Vaccine } from '../../../domain/vaccine';
import { VaccineFakeAPIRepo } from '../../../vaccine/repository/fake_api';

const vaccineRepo = new VaccineFakeAPIRepo();

const userRepo = new UserFakeAPIRepo();
const adminUserUC = new AdminUserUC(userRepo);

interface FilterFormData {
    vaccinationState: boolean;
    vaccineId: number[];
    initialDate: string;
    finalDate: string;
}

const AdminPage = () => {
    const [addModalVisibility, setAddModalVisibility] = React.useState<boolean>(false);
    const [editModalVisibility, setEditModalVisibility] = React.useState<boolean>(false);
    const [deleteModalVisibility, setDeleteModalVisibility] = React.useState<boolean>(false);

    const userColumns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 130 },
        { field: 'lastname', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 175 },
        { field: 'username', headerName: 'Username', width: 130 },
        { field: 'password', headerName: 'Password', width: 200 },

        { field: 'vaccineState', valueGetter: (params) => { return params.row.vaccineState ? "YES" : "NO" }, headerName: 'Vaccination State', width: 130 },
        { 
            field: 'vaccineHistory', 
            renderCell: (params: GridRenderCellParams<VaccineHistory[]>) => (
                <div>
                    {
                        params.row.vaccineHistory.map((vaccineHist: VaccineHistory) => <div key="vaccineHist.id">
                            #{vaccineHist.dosisNumber} {vaccineHist.vaccine?.name}, {vaccineHist.vaccinationDate}
                        </div>)
                    }
                </div>
            ),
            headerName: 'Vaccination History',
            width: 200 
        },
    ];

    const [users, setUsers] = React.useState<User[]>([]);
    const getUsers = async() => {
        const users = await adminUserUC.list();
        setUsers(users);
    }
    const getUsersFiltered = async() => {
        let usersFiltered = await adminUserUC.list();

        usersFiltered = usersFiltered.filter (el => {
            let isInVaccine = true
            if (filterFormData.vaccineId.length > 0) {
                isInVaccine = false
                el.vaccineHistory.forEach(vac => {
                    if (filterFormData.vaccineId.includes(vac.vaccineId)) {
                        isInVaccine = true
                    }
                })
            }

            let isInDate = true
            if (filterFormData.initialDate.trim().length > 0 && filterFormData.finalDate.trim().length > 0 ) {
                isInDate = false

                let initialDateArray = filterFormData.initialDate.split("-").map(comp => parseInt(comp))
                let finalDateArray = filterFormData.finalDate.split("-").map(comp => parseInt(comp))
                
                let initialDateInMilis = new Date(initialDateArray[0], initialDateArray[1], initialDateArray[2])
                let finalDateInMilis = new Date(finalDateArray[0], finalDateArray[1], finalDateArray[2])

                el.vaccineHistory.forEach(vac => {
                    let dateArray = vac.vaccinationDate.split("-").map(comp => parseInt(comp))
                    let dateInMilis = new Date(dateArray[0], dateArray[1], dateArray[2])

                    if (
                        (dateInMilis >= initialDateInMilis && dateInMilis <= finalDateInMilis)
                        || (dateInMilis <= initialDateInMilis && dateInMilis >= finalDateInMilis)
                    ) {
                        isInDate = true
                    }
                })
            }

            return el.vaccineState === filterFormData.vaccinationState
                && isInVaccine && isInDate
        })

        setUsers(usersFiltered);
    }

    const [vaccines, setVaccines] = React.useState<Vaccine[]>([]);
    const getVaccines = async() => {
        vaccineRepo.list()
            .then((vaccines: Vaccine[]) => {
                setVaccines(vaccines);
            })
            .catch((err: string) => {console.log(err)})
    }

    const [filterFormData, setFilterFormData] = React.useState<FilterFormData>({
        vaccinationState: false,
        vaccineId: [],
        initialDate: "",
        finalDate: ""
    });
    const handleFilterChange = (prop: keyof FilterFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (prop === 'vaccinationState') {
            setFilterFormData({ ...filterFormData, [prop]: !filterFormData.vaccinationState });
            return
        }

        setFilterFormData({ ...filterFormData, [prop]: event.target.value });
    };
    const handleSelectFilterChange = (prop: keyof FilterFormData) => (event: SelectChangeEvent<number[]>) => {
        setFilterFormData({ ...filterFormData, [prop]: event.target.value});
    };

    const [userSelected, setUserSelected] = React.useState<User>(new User("", "", "", "", 0));
    const [usersSelected, setUsersSelected] = React.useState<User[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    const openEditModal = () => {
        let userSelected = users.find( userInArray => userInArray.id === selectionModel[0] )        
        setUserSelected(JSON.parse(JSON.stringify(userSelected)))

        console.log(userSelected)
        setEditModalVisibility(true)
    }

    const openDeleteModal = () => {
        let usersSelectedInTable = users.filter( userInArray => selectionModel.includes(userInArray.id) )
        setUsersSelected(JSON.parse(JSON.stringify(usersSelectedInTable)))

        setDeleteModalVisibility(true)
    }

    const filterByDate = () => {
        let usersSelectedInTable = users.filter( userInArray => selectionModel.includes(userInArray.id) )
        setUsersSelected(JSON.parse(JSON.stringify(usersSelectedInTable)))

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
        getVaccines();
    }, [])

    return (
        <MainLayout>

            <ModalAdd
                visibility={addModalVisibility}
                handleVisibility={setAddModalVisibility}
                handleFinishAction={getUsers}
            ></ModalAdd>

            <ModalEdit
                visibility={editModalVisibility}
                handleVisibility={setEditModalVisibility}
                handleFinishAction={() => {
                    setSelectionModel([])
                    getUsers()
                }}
                user={userSelected}
            ></ModalEdit>

            {
                usersSelected.length === 0 ? <div></div> : 
                <ModalDelete
                    visibility={deleteModalVisibility}
                    handleVisibility={setDeleteModalVisibility}
                    handleFinishAction={() => {
                        setSelectionModel([])
                        setUsersSelected([])
                        getUsers()
                    }}
                    users={usersSelected}
                ></ModalDelete>
            }

            <div className='flex items-center justify-between'>
                <h1>Users</h1>
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
                    <Button
                        sx={{ m: 1 }}
                        variant="contained"
                        color='warning'
                        onClick={openEditModal}
                        startIcon={<Edit />}
                        disabled={selectionModel.length !== 1}
                    >
                        Edit
                    </Button>
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
            </div>

            <Accordion>
                <AccordionSummary
                    expandIcon={<GridExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <FilterAlt></FilterAlt>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Filters
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={filterFormData.vaccinationState}
                                        onChange={handleFilterChange('vaccinationState')}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />}
                                    label="Vaccination State"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-vaccine">Vaccine</InputLabel>
                                <Select
                                    labelId="demo-simple-select-vaccine"
                                    id="demo-simple-vaccine"
                                    label="Vaccine"
                                    multiple
                                    value={filterFormData.vaccineId}
                                    onChange={handleSelectFilterChange('vaccineId')}
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-initial-date">Initial Date</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-initial-date"
                                    type="date"
                                    margin="dense"
                                    value={filterFormData.initialDate}
                                    onChange={handleFilterChange('initialDate')}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Event></Event>
                                        </InputAdornment>
                                    }
                                    label="Initial Date"
                                    /* error={validationErrors.email.length > 0} */
                                />
                                {/* {
                                    validationErrors.email.length === 0 ? <div></div> :
                                    <FormHelperText error id="email-error">
                                        { validationErrors.email.reduce((error, currentError) => {
                                            return currentError + (". " + error)
                                        }, "") }
                                    </FormHelperText>
                                } */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-final-date">Final Date</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-final-date"
                                    type="date"
                                    margin="dense"
                                    value={filterFormData.finalDate}
                                    onChange={handleFilterChange('finalDate')}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Event></Event>
                                        </InputAdornment>
                                    }
                                    label="Final Date"
                                    /* error={validationErrors.email.length > 0} */
                                />
                                {/* {
                                    validationErrors.email.length === 0 ? <div></div> :
                                    <FormHelperText error id="email-error">
                                        { validationErrors.email.reduce((error, currentError) => {
                                            return currentError + (". " + error)
                                        }, "") }
                                    </FormHelperText>
                                } */}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} className="flex justify-end">
                            <Button
                                color='success'
                                onClick={() => getUsers()}
                                startIcon={<FilterAltOff />}
                            >
                                Clean
                            </Button>
                            <div style={{ paddingLeft: ".5rem" }}></div>
                            <Button
                                variant="contained"
                                color='success'
                                onClick={() => getUsersFiltered()}
                                startIcon={<Search />}
                            >
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <div style={{ minHeight: "400px", height: 400, width: '100%', marginTop: "1rem" }}>
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