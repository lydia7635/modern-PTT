import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import styled from 'styled-components';
import Link from '@mui/material/Link';

//do styling
const StyledDiv = styled.div`
  border: solid 1px grey;
  border-radius: 10px;
`

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 250,
    backgroundColor: theme.palette.background.paper,
  },
}));

const BoardListData = [
  {
    ename: "Ntu",
    cname: "台灣大學",
    board_id: 124565432,
    board_detail: "這是台灣大學版！！"
  },
  {
    ename: "Ntcu",
    cname: "交通大學",
    board_id: 12456543333,
    board_detail: "這是交通大學版！！"
  },
  {
    ename: "Ntust",
    cname: "台灣科技大學",
    board_id: 1245654213,
    board_detail: "這是台灣科技大學版！！"
  },
  {
    ename: "Ntnu",
    cname: "台灣師範大學",
    board_id: 1245654324,
    board_detail: "這是NTNU版！！"
  }
]

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function SimpleList() {
  const classes = useStyles();

  return (
    <StyledDiv className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button id="popular">
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <Link href="hot">
            <ListItemText primary="熱門看板" />
          </Link>
        </ListItem>
        <ListItem button id="separate" value="separates" onClick={(e) => console.log(e.target.value)}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <Link href="category">
            <ListItemText primary="分類看板" />
          </Link>
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        {BoardListData.map((item) => (
          <ListItem button id={item.ename}>
            <ListItemText primary={item.ename} secondary={item.board_detail} />
          </ListItem>
        ))}
      </List>
    </StyledDiv>
  );
}