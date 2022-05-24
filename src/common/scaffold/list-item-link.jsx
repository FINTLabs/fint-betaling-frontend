import ListItem from '@mui/material/ListItem';
import React from 'react';

const ListItemLink = (props) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ListItem button {...props} />
);

export default ListItemLink;
