'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from '@/components/Link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // Runtime API URL loaded from public/config.json (fallback to NEXT_PUBLIC_API_URL or default)
  const [apiUrl, setApiUrl] = useState(null)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/config.json')
        if (!res.ok) return
        const cfg = await res.json()
        if (mounted && cfg && cfg.API_URL) setApiUrl(cfg.API_URL)
      } catch (e) {
        // ignore — fallback will be used
      }
    })()
    return () => { mounted = false }
  }, [])

  // Submit handler: POST credentials to backend login endpoint, set authToken cookie, then redirect to `from` query or '/'
  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Build payload expected by the FastAPI user login endpoint
      const payload = {
        email: email,
        password: password,
      }

      // Backend API base URL — prefer NEXT_PUBLIC_API_URL if set, otherwise use provided IP
      // Choose API URL from runtime config, env, or fallback
      const envApi = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.18.11:8000'
      let API_URL = apiUrl || envApi

      // Ensure API_URL includes protocol
      if (!API_URL.startsWith('http://') && !API_URL.startsWith('https://')) {
        API_URL = 'http://' + API_URL
      }

      // Build absolute URL reliably
      const url = new URL('/user/login', API_URL).toString()

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      // Parse response safely: backend may return HTML (error page) instead of JSON
      let data = null
      const contentType = res.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        data = await res.json()
      } else {
        // Read the response as text to surface helpful error info (e.g., HTML error pages)
        const text = await res.text()
        const preview = text ? text.replace(/\s+/g, ' ').slice(0, 300) : ''
        throw new Error(`Server returned ${res.status} ${res.statusText}: ${preview || 'Non-JSON response'}`)
      }

      if (!res.ok) {
        const message = data?.detail || data?.message || 'Login failed'
        throw new Error(message)
      }

      // Expecting access token in response as accessToken or access_token
      const token = data?.accessToken || data?.access_token || data?.token || data?.access_token

      if (!token) {
        throw new Error('No access token returned from server')
      }

      // Set cookie (not HttpOnly here because client-side). For production, set HttpOnly cookie from server-side for security.
      const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 // 30 days vs 1 day
      const expires = new Date(Date.now() + maxAge * 1000).toUTCString()
      document.cookie = `authToken=${token}; Path=/; Expires=${expires};` + (location.protocol === 'https:' ? ' Secure;' : '')

      // Optionally set refresh token if returned
      const refresh = data?.refreshToken || data?.refresh_token
      if (refresh) {
        const refreshExpires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000).toUTCString()
        document.cookie = `refresh_token=${refresh}; Path=/; Expires=${refreshExpires};` + (location.protocol === 'https:' ? ' Secure;' : '')
      }

      // Redirect back to original path if present
      const params = new URLSearchParams(window.location.search)
      const from = params.get('from') || '/' 
      router.push(from)
    } catch (err) {
      console.error('Login error', err)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center' style={{ minHeight: '100vh', position: 'relative', padding: 24 }}>
      <Card className='flex flex-col sm:w-[450px]'>
        <CardContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Box>
              <Typography variant="h4">{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography sx={{ mb: 1 }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
            >
              <TextField
                autoFocus
                fullWidth
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Password"
                id="outlined-adornment-password"
                type={isPasswordShown ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <FormControlLabel control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />} label="Remember me" />
                <Typography
                  sx={{ textAlign: 'right', color: 'primary.main', cursor: 'pointer' }}
                  component={Link}
                  href="/forgot-password"
                >
                  Forgot password?
                </Typography>
              </Box>

              {error && (
                <Typography color="error" sx={{ textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Button fullWidth variant="contained" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Log In'}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography>New on our platform?</Typography>
                <Typography
                  component={Link}
                  href="/register"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                >
                  Create an account
                </Typography>
              </Box>

              <Divider>or</Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ color: '#4267B2' }}>
                  <i className="ri-facebook-fill" />
                </IconButton>
                <IconButton sx={{ color: '#1DA1F2' }}>
                  <i className="ri-twitter-fill" />
                </IconButton>
                <IconButton>
                  <i className="ri-github-fill" />
                </IconButton>
                <IconButton sx={{ color: '#DB4437' }}>
                  <i className="ri-google-fill" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
