import React, { useEffect } from "react"
import { AppBar, Avatar, Box, Container, Divider, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { UserFakeAPIRepo } from "../user/repository/fake_api";
import { AuthUserUC } from "../user/usecase/auth_usecase";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "../domain/user";

const userRepo = new UserFakeAPIRepo();
const authUserUC = new AuthUserUC(userRepo);

const MainLayout: React.FC<any> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = React.useState<User>(new User("", "", "", "", 0));

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = async() => {
        const isLogout = await authUserUC.logout()
        if (isLogout) {
            handleCloseUserMenu()
            navigate("/login")
        }
    }

    useEffect(() => {
        authUserUC.getUserByToken()
            .then(user => {
                if (user === null) {
                    navigate("/login")
                }
                setUser(user as User)

                if (user?.rolId === 1 && location.pathname === "/employee") {
                    navigate("/admin")
                } else if (user?.rolId === 2 && location.pathname === "/admin") {
                    navigate("/employee")
                }
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <AppBar position="fixed" component="nav" sx={{ color: "white" }}>
                <Toolbar>
                    <div style={{ width: "100%" }}>
                        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
                            Vaccination Inventory
                        </Typography>
                    </div>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar>{user.name.slice(0, 1).toUpperCase()}{user.lastname.slice(0, 1).toUpperCase()}</Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem className="flex column" sx={{textAlign: "left", alignItems: "flex-start"}}>
                                <b>
                                    {  user.name.toLocaleUpperCase() } {  user.lastname.toLocaleUpperCase() }
                                </b>
                                <span>
                                    {  user.email }
                                </span>
                            </MenuItem>
                            <Divider></Divider>
                            <MenuItem onClick={logout}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container sx={{pt: 6}}>
                <Box sx={{ p: 2 }} component="main">
                    { children }
                </Box>
            </Container>
        </div>
    )
}

export default MainLayout;