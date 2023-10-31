import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

export const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(isOpen);
  };

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)} edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {['Add Expense', 'Expense List', 'Card Usage'].map((text) => (
              <ListItemButton key={text} component={Link} to={`/${text.replace(' ', '').toLowerCase()}`}>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};
