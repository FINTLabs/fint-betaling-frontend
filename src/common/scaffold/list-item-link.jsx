import ListItem from '@material-ui/core/ListItem';
import React from 'react';

const ListItemLink = (props) => (
    <ListItem button component="a" {...props} />
);

export default ListItemLink;
