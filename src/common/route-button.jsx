import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const RouteButton = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button component={Link} {...props} />
);

export default RouteButton;
