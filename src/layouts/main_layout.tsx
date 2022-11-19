import React from "react"
import { Box } from "@mui/material";
//import { useNavigate } from "react-router-dom";

const MainLayout: React.FC<any> = ({ children }) => {
    //const navigate = useNavigate();

    return (
        <Box>
            { children }
        </Box>
    )
}

export default MainLayout;