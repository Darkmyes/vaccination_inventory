import React, { useEffect } from "react"
import { Box, Container } from "@mui/material";
import { UserFakeAPIRepo } from "../user/repository/fake_api";
import { AuthUserUC } from "../user/usecase/auth_usecase";
import { useNavigate } from "react-router-dom";

const userRepo = new UserFakeAPIRepo();
const authUserUC = new AuthUserUC(userRepo);

const MainLayout: React.FC<any> = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        authUserUC.getUserByToken()
            .then(user => {
                if (user == null) {
                    navigate("/login")
                }
            })
            .catch(err => console.log(err))
    })

    return (
        <Container>
            <Box sx={{ p: 2 }}>
                { children }
            </Box>
        </Container>
    )
}

export default MainLayout;