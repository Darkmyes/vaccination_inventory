import * as React from 'react';
import { Box, Button } from "@mui/material";

import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate()

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

export default NotFoundPage