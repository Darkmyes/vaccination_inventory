import * as React from 'react';
import { Button, OutlinedInput, InputAdornment, IconButton, Card, CardContent, InputLabel, FormControl, Snackbar, Slide, Alert, Modal, CircularProgress } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import EmptyLayout from '../layouts/empty_layout';
import { Person, Lock } from '@mui/icons-material';
import { UserFakeAPIRepo } from '../user/repository/fake_api';
import { AuthUserUC } from '../user/usecase/auth_usecase';
import { Box } from '@mui/system';

const userRepo = new UserFakeAPIRepo();
const authUserUC = new AuthUserUC(userRepo);

interface LoginState {
    username: string,
    password: string,
    showPassword: boolean
}

function TransitionDown(props: any) {
    return <Slide {...props} direction="down" />;
}

const LoginPage = () => {
    const navigate = useNavigate()

    const [values, setValues] = React.useState<LoginState>({
        username: "",
        password: "",
        showPassword: false
    });
    const handleChange = (prop: keyof LoginState) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleLoginButton = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setLoaderModalVisibility(true)
        const user = await authUserUC.login(values.username, values.password)
        setLoaderModalVisibility(false)

        if (user != null) {
            navigate("/admin")
        } else {
            setSnackbarVisibility(true)
        }
    };

    const [snackbarVisibility, setSnackbarVisibility] = React.useState<boolean>(false);
    const handleCloseSnackbar = () => {
        setSnackbarVisibility(false);
    };

    const [loaderModalVisibility, setLoaderModalVisibility] = React.useState<boolean>(false);

    React.useEffect(() => {
        authUserUC.getUserByToken()
            .then(user => {
                if (user != null) {
                    if (user.rolId === 1) {
                        navigate("/admin")
                    } else {
                        navigate("/employee")
                    }
                }
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <EmptyLayout>
            <Card>
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
                            onClick={handleLoginButton}
                        >
                            Login
                        </Button>
                    </FormControl>
                </CardContent>
            </Card>

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
        </EmptyLayout>
    )
}

export default LoginPage