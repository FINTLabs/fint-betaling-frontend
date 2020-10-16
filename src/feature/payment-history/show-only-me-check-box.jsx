import React from 'react';
import Box from "@material-ui/core/Box";
import {Checkbox} from "@material-ui/core";

const ShowOnlyMeCheckBox = (props) => {
    const {classes, handleOnlyMeCheck, checked} = props;
    return (
        <Box mt={1} className={classes.onlyMeCheckbox}>
            <Checkbox color={"secondary"} onChange={handleOnlyMeCheck} checked={checked}/>
            Vis bare mine ordre
        </Box>
    );
};

export default ShowOnlyMeCheckBox;