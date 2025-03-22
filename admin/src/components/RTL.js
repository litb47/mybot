import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { createTheme } from '@mui/material/styles';

// יצירת קונפיגורציה ל-RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// יצירת ערכת נושא RTL
const theme = createTheme({
  direction: 'rtl',
});

export default function RTL(props) {
  return (
    <CacheProvider value={cacheRtl}>
      {props.children}
    </CacheProvider>
  );
} 