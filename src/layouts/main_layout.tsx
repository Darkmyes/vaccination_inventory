import React from "react"
import { Box, Container } from "@mui/material";
//import { useNavigate } from "react-router-dom";

const MainLayout: React.FC<any> = ({ children }) => {
    //const navigate = useNavigate();

    return (
        <Container>
            <Box sx={{ p: 2 }}>
                { children }
            </Box>
        </Container>
    )
}

export default MainLayout;