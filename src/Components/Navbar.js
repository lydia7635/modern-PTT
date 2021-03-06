import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';


import Button from '@mui/material/Button';
// const [showAlert, setShowAlert] = useState(null)
import { useState, useEffect, useContext} from 'react';
import { useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Row from './Layout/Row';
import Column from './Layout/Column';

//selection
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { fontWeight } from '@mui/system';

// LogIn / SignUp
import AlertDialog from "./Alert";
import Login from "./Login";
import SingUp from "./SingUp";
import { LOG_OUT_MUTATION, GET_BOARD_QUERY  } from  "../graphql";
import { useMutation } from '@apollo/client';

import { pttContext } from '../Containers/App';

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar:{
    boxShadow: 'none',
    backgroundColor: '#333',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
    },
  },
  iconContainer:{
    padding: '5px',
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: '90%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    
  },
  inputInput: {
    padding: theme.spacing(0, 1, 0, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
    transition: theme.transitions.create('width'),
    width: '100px',
    [theme.breakpoints.up('sm')]: {
      width: '1000px',
    },
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));


const LOCALSTORAGE_USERNAME = "saveMyUsername";
const LOCALSTORAGE_HASHEDPW = "saveMyHashedPassword";


export default function PrimarySearchAppBar() {

  const {
    username,
    setUsername,
    myHashPassword,
    setMyHashPassword,
    isLogIn,
    setIsLogIn,

    simpleBoardSearch, setSimpleBoardSearch,
    advBoardSearch, setAdvBoardSearch,
    advTitleSearch, setAdvTitleSearch,
    timeSearch, setTimeSearch,
    ownerSearch, setOwnerSearch,

    } = useContext(pttContext)

    const navigate = useNavigate();
  // insert ===========================
  const [splits_boards, setSplits_boards] = useState([""])
  const [boardInput, setBoardInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [timeInput, setTimeInput] = useState(240);
  const [ownerInput, setOwnerInput] = useState("");


  const time_interval = [
    {time:6,name:"6?????????"},
    {time:12,name:"12?????????"},
    {time:72,name:"3??????"},
    {time:168,name:"?????????"}
  ]




  const handleBasicSearch =  () => {
    var splits_boards2 = splits_boards.split(" ");
    setSimpleBoardSearch(splits_boards2);
    navigate("/search/boards")
  }

  const handleAdvanceSearch =  () => {
    var splits_boards = boardInput.split(" ");
    var splits_title = titleInput.split(" ");

    setAdvBoardSearch(splits_boards);
    setAdvTitleSearch(splits_title);
    setOwnerSearch(ownerInput);
    setTimeSearch(timeInput);
    navigate("/search/Articles")
  }
  // Advance Search
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () =>{
    setOpen(false);
    // QUERY
  }
  const LoginButton = () =>(            
    <AlertDialog
        btntext="Login"
        maintitle="Login"
        mainfiled=
            {<Login
                username={username}
                setUsername={setUsername}
                myHashPassword={myHashPassword}
                setMyHashPassword={setMyHashPassword}
                isLogIn={isLogIn}
                setIsLogIn={setIsLogIn}
            />}
    />)

    const SignUpButton = () =>(            
        <AlertDialog
            btntext="SingUp"
            maintitle="SingUp"
            mainfiled=
                {<SingUp
                    setUsername={setUsername}
                    setMyHashPassword={setMyHashPassword}
                    isLogIn={isLogIn}
                    setIsLogIn={setIsLogIn}
                />}
        />)

  // logout
  const [checkLogout] = useMutation(LOG_OUT_MUTATION);

  const logout = async () => {
    
    if(!username || !myHashPassword) {
        console.log("username and hashed password cannot be null");
        return;
    }

    const logoutResult = await checkLogout({
        variables:{
            username: username,
            password: myHashPassword,
        }
    });

    if(logoutResult.data?.logout) {
        console.log("logout~~");
        setIsLogIn(false);
        setMyHashPassword("");
        setUsername("");

        localStorage.removeItem(LOCALSTORAGE_USERNAME);
        localStorage.removeItem(LOCALSTORAGE_HASHEDPW);
    } else {
        console.log("logout error...");
    }
}



  // TODO:  Mutation in Search
  //  =================================

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';

  const guestMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
        <Link href ="/signup">
          <MenuItem onClick={handleMenuClose} >Sign Up</MenuItem>
        </Link>
        <Link href ="/login">
          <MenuItem onClick={handleMenuClose} >Log In</MenuItem>
        </Link>
    </Menu>
  );

  const userMenu =  (
      <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={()=>handleMenuClose}
    >

        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        <MenuItem onClick={handleMenuClose}>Setting</MenuItem>
        <MenuItem onClick={()=>{logout();handleMenuClose()}} color="red">Log Out</MenuItem>
    </Menu>
    )
  

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <MenuItem>
        <Tooltip title="??????">  
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </MenuItem>

      <MenuItem>
        <IconButton aria-label="show 20 new mails" color="inherit">
          <Badge badgeContent={20} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>

      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            <Link underline="none" href="/home" className="text-gradient nav-title">
              ModernPTT
            </Link>
          </Typography>
          <div className={classes.search}>

            <InputBase
              placeholder="????????????..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={splits_boards}
              onChange={(e) => {setSplits_boards(e.target.value);
                console.log(splits_boards)

              }}
              inputProps={{ 'aria-label': 'search' }}
            />

            <Button onClick={handleOpen} >????????????</Button>

            <Modal 
              width="500"
              open={open}
              onClose={handleClose}
              display="flex"
              align-items="center"
              justify-content="center"
            >
                <Card  sx={{position: 'absolute', width: 500 }}>
                    <p>????????????</p>
                    <div padding="20px">
                    <Column>
                      <Row>??????
                        <TextField  
                          fullWidth
                          placeholder="????????????????????????????????? B k"
                          id="board_search" 
                          value={boardInput} 
                          onChange={(e)=>setBoardInput(e.target.value)} 
                          variant="outlined" 
                        />
                      </Row>
                      <Row>
                        ??????
                        <TextField  
                          fullWidth
                          placeholder="????????????id"
                          id="board_search" 
                          value={ownerInput} 
                          onChange={(e)=>setOwnerInput(e.target.value)} 
                          variant="outlined" 
                        />
                      </Row>
                      <Row>
                        ??????
                        <TextField  
                          fullWidth
                          placeholder="????????????????????????????????? B k"
                          id="title_search" 
                          value={titleInput} 
                          onChange={(e)=>setTitleInput(e.target.value)} 
                          variant="outlined" 
                        />
                      </Row>
                      <Row>??????</Row>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                        {/* <FormHelperText>Without label</FormHelperText>  */}
                          <Select
                            value={timeInput}
                            onChange={(e)=>setTimeInput(e.target.value)}
                            displayEmpty
                          >
                            {time_interval.map((item, index)=>(
                              <MenuItem  key={index} value={item.time}>{item.name}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                    </Column>
                    </div>
                  <div>
                    <Button onClick={handleClose} >??????</Button>
                    <Button onClick={()=>{handleAdvanceSearch();handleClose()}} >??????</Button>
                  </div>
                </Card>
            </Modal>


            <IconButton className={classes.iconContainer}>
                <SearchIcon onClick={()=>handleBasicSearch()}/>
            </IconButton>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          {(isLogIn)?
              <>

                <Tooltip title="?????????">
                  <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                      <MailIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </>
              :<></>}
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>
          
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {/* {renderMenu} */}
      {(isLogIn)?userMenu:guestMenu}
    </div>
  );
}
