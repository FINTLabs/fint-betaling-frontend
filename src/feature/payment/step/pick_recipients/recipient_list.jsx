import React from 'react';
import {useSelector} from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {ListItemIcon, ListItemText} from "@material-ui/core";
import PaymentIcon from '@material-ui/icons/Payment';


const RecipientList = () => {
    const recipientList = useSelector(state => state.payment.recipients);

    return (

        <List>
            {recipientList}
            <ListItem>
                <ListItemIcon>
                    <PaymentIcon/>
                </ListItemIcon>
                <ListItemText>

                </ListItemText>
            </ListItem>
        </List>
    );
};

export default RecipientList;