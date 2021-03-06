import React, {Component, Fragment } from 'react';
import {
    AppBar, Toolbar, IconButton, Typography, Hidden, Drawer, CssBaseline, List, ListItem, ListItemText, ListItemIcon,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Menu, Add, Settings, PieChart, LibraryBooks } from '@material-ui/icons';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import 'typeface-roboto';
import { Scrollbars } from 'react-custom-scrollbars';

const drawerWidth = 240;

const styles = theme => ({
    root: {
      fontFamily: 'roboto, sans-serif',
      flexGrow: 1,
      height: 440,
      zIndex: 1,
      position: 'relative',
      display: 'flex',
      width: '100%',
      overflow: 'hidden',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    navIconHide: {
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      height: window.innerHeight,
      width: drawerWidth,
      [theme.breakpoints.up('md')]: {
        position: 'relative',
      },
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
    },
  });

class Layout extends Component {
    state = {
        mobileOpen: false,
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    }

    render () {
        const { classes, location: { pathname }, children } = this.props;

        const drawer = (
          <div>
            <Hidden smDown>
                <div className={classes.toolbar} />
            </Hidden>
            <List>
                <ListItem component={Link} onClick={this.handleDrawerToggle} to='/' selected={'/' === pathname}>
                    <ListItemIcon><Add /></ListItemIcon><ListItemText primary="Add Entry" />
                </ListItem>
                <ListItem component={Link} onClick={this.handleDrawerToggle} to='/timeline' selected={'/timeline' === pathname}>
                    <ListItemIcon><LibraryBooks /></ListItemIcon>
                <ListItemText primary="My Entries" /></ListItem>
                <ListItem component={Link} onClick={this.handleDrawerToggle} to='/insights' selected={'/insights' === pathname}>
                    <ListItemIcon><PieChart /></ListItemIcon>
                <ListItemText primary="Insights" /></ListItem>
                <ListItem component={Link} onClick={this.handleDrawerToggle} to='/settings' selected={'/settings' === pathname}>
                    <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText primary="Settings" /></ListItem>
            </List>
          </div>
        );

        return (
            <Fragment>
                <CssBaseline/>
                <div className={classes.root} style={{height: '100vh'}}>
                    <AppBar position='absolute' className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerToggle}
                        className={classes.navIconHide}
                        >
                        <Menu />
                        </IconButton>
                        <Typography variant="title" color="inherit" noWrap>
                        Tally Diary
                        </Typography>
                    </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        open={this.state.mobileOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        style={{fontFamily: "roboto"}}
                        ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        style={{height: '100vh'}}
                    >
                        {drawer}
                    </Drawer>
                    </Hidden>
                    <Scrollbars>
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                                {children}
                        </main>
                    </Scrollbars>
                </div>
            </Fragment>
        );
    }
}

export default compose(
    withRouter, 
    withStyles(styles)
)(Layout)