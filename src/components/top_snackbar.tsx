import * as React from 'react';
import { Snackbar, Slide, Alert, AlertColor } from "@mui/material";

function TransitionDown(props: any) {
    return <Slide {...props} direction="down" />;
}

export interface TopSnackbarProps {
    message: string;
    severity: AlertColor | undefined;
    visibility: boolean;
    handleVisibility: Function;
}

const TopSnackbar : React.FC<TopSnackbarProps> = (props) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={props.visibility}
            onClose={() => props.handleVisibility(false)}
            autoHideDuration={2000}
            key="topCenterSnackbar"
            TransitionComponent={TransitionDown}
        >
            <Alert severity={ props.severity }> { props.message } </Alert>
        </Snackbar>
    )
}

export default TopSnackbar