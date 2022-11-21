import * as React from 'react';
import { Button, Card, CardContent } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <Card
            sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '275px'
            }}
                >
                    <CardContent className='flex column items-center'>
                        <h2>404 Error</h2>
                        <p>Oops!! The page you are looking for does not exist.</p>
                        <Button
                            onClick={() => navigate("/")}
                            variant="contained"
                            color="success"
                            sx={{ fontWeight: "bolder" }}
                        >
                            Go to Home Page
                        </Button>
                    </CardContent>
                </Card>
    )
}

export default NotFoundPage