import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import GlobalStyle from './styles/global'
import { ThemeProvider } from 'styled-components'
import dark from './styles/themes/dark'
import light from './styles/themes/light'
import Message from './components/Message/Message'
import Navbar from './components/Navbar/Navbar'
import Content from './components/Content/Content'
import { AuthProvider } from './context/AuthContext';

function App() {

  const [theme, setTheme] = useState(dark)

    function toggleTheme() {
        setTheme(theme === dark ? light : dark)
    }

  return (
   <ThemeProvider theme={theme}>
      <GlobalStyle/>
      <Router>
        <AuthProvider>
          <Navbar toggleTheme={toggleTheme} />
          <Message />
          <Content />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
