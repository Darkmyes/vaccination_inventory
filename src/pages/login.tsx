import * as React from 'react';
import { Box, Button } from "@mui/material";

import './Error_404_Not_Found.css'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
    const navigate = useNavigate()

    /* useEffect(() => {
        setTimeout(() => {
            document.querySelector('.cont_principal')
                .className = "cont_principal cont_error_active";
        }, 20)
    }); */

    return (
        <Box className="cont_principal">
            <div className="cont_error">
                <h2>404</h2>
                <p>Oops!!, The page you are looking for does not exist.</p>
                <Button
                    onClick={() => navigate("/")}
                    variant="outlined"
                    sx={{ fontWeight: "bolder", color: "rgb(0 174 79)" }}
                >
                    Go to Home Page
                </Button>
            </div>
            <div className="cont_aura_1"></div>
            <div className="cont_aura_2"></div>
        </Box>
    )
}

export default LoginPage