import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const RouteButton = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button component={Link} {...props} />
);

export default RouteButton;
