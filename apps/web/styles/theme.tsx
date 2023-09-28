"use client";
import { forwardRef } from 'react';

import NextLink from 'next/link';

import {
  purple,
  teal,
} from '@mui/material/colors';
// const getDesignTokens = (mode: PaletteMode) => ({
//     palette: {
//         mode,
//         ...(mode === 'light'
//             ? {
//                 // palette values for light mode
//                 primary: amber,
//                 divider: amber[200],
//                 text: {
//                     primary: grey[900],
//                     secondary: grey[800],
//                 },
//             }
//             : {
//                 // palette values for dark mode
//                 primary: deepOrange,
//                 divider: deepOrange[700],
//                 background: {
//                     default: deepOrange[900],
//                     paper: deepOrange[900],
//                 },
//                 text: {
//                     primary: '#fff',
//                     secondary: grey[500],
//                 },
//             }),
//     },
// });
import {
  createTheme,
  PaletteColor,
} from '@mui/material/styles';

const LinkBehaviour = forwardRef(function LinkBehaviour(props: any, ref: any) {
  return <NextLink ref={ref} {...props} />;
});

const { palette } = createTheme();
export const theme = createTheme({
  palette: {
    mode: "dark",
    purple: palette.augmentColor({ color: purple }),
    lightBlue: palette.augmentColor({ color: { main: "#596f89" } }),
    // #679097
    // #213052
    // #919798
    // #2c4991
    primary: {
      main: teal[600],
    },
    secondary: {
      main: purple["300"],
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#999999",
    },
  },
  components: {
    // Name of the component
    MuiTextField: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          //   fontSize: '1rem',
          color: "#dddddd",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        //@ts-ignore
        component: LinkBehaviour,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    purple: PaletteColor;
    lightBlue: PaletteColor;
  }
  interface PaletteOptions {
    purple?: PaletteColor;
    lightBlue?: PaletteColor;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    purple: true;
    lightBlue: true;
  }
}
