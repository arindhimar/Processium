import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Alert,
    Collapse,
    useTheme,
    useMediaQuery,
    Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─── Decorative SVG blob for left panel ─── */
function BrandPanel() {
    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '46%',
                minHeight: '100vh',
                bgcolor: '#111827',
                p: 6,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Top-right circle accent */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -80,
                    right: -80,
                    width: 320,
                    height: 320,
                    borderRadius: '50%',
                    bgcolor: 'rgba(99,102,241,0.15)',
                    filter: 'blur(2px)',
                }}
            />

            {/* Bottom-left accent */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -60,
                    left: -60,
                    width: 260,
                    height: 260,
                    borderRadius: '50%',
                    bgcolor: 'rgba(16,185,129,0.08)',
                }}
            />

            {/* Grid dot pattern */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                        'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    zIndex: 0,
                }}
            />

            {/* Brand name */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        component="img"
                        src="/bp-square_Logo.png"
                        alt="Processium"
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            objectFit: 'contain',
                            bgcolor: '#fff',
                            p: '4px',
                        }}
                    />
                    <Typography
                        sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            letterSpacing: '0.02em',
                        }}
                    >
                        Processium
                    </Typography>
                </Box>
            </Box>

            {/* Center content */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                    sx={{
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: { md: '2.2rem', lg: '2.75rem' },
                        lineHeight: 1.2,
                        mb: 2,
                    }}
                >
                    Workforce<br />
                    management<br />
                    <Box component="span" sx={{ color: '#6366f1' }}>simplified.</Box>
                </Typography>
                <Typography
                    sx={{
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        maxWidth: 320,
                    }}
                >
                    Track attendance, manage requisitions, and oversee your team — all from one intelligent platform.
                </Typography>

            </Box>
        </Box>
    );
}

/* ─── Main Login Page ─── */
export default function LoginPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ssoLoading] = useState(false);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailError = touched.email && !EMAIL_REGEX.test(email)
        ? 'Enter a valid email address'
        : '';
    const passwordError = touched.password && !password
        ? 'Password is required'
        : '';
    const isFormValid = EMAIL_REGEX.test(email) && password.length > 0;

    const handleBlur = (field) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!isFormValid) return;

        setLoading(true);
        setError('');

        try {
            await login({ email, password });
            // Navigate to dashboard or home after successful login
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* No-op: UI only */
    const handleMicrosoftLogin = () => {
        // TODO: Implement Microsoft SSO
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* ── Left branding panel ── */}
            <BrandPanel />

            {/* ── Right form panel ── */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fafafa',
                    px: { xs: 3, sm: 6, md: 8 },
                    py: 6,
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    {/* Mobile logo */}
                    {isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
                            <Box
                                component="img"
                                src="/bp-square_Logo.png"
                                alt="Processium"
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '8px',
                                    objectFit: 'contain',
                                }}
                            />
                            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
                                Processium
                            </Typography>
                        </Box>
                    )}

                    {/* Heading */}
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, color: '#111827', mb: 0.75 }}
                    >
                        Welcome back
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mb: 4 }}>
                        Sign in to continue to your workspace.
                    </Typography>

                    {/* Error alert */}
                    <Collapse in={!!error}>
                        <Alert
                            severity="error"
                            onClose={() => setError('')}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                fontSize: '0.85rem',
                                bgcolor: '#fef2f2',
                                color: '#991b1b',
                                border: '1px solid #fecaca',
                                '& .MuiAlert-icon': { color: '#ef4444' },
                            }}
                        >
                            {error}
                        </Alert>
                    </Collapse>

                    {/* Form */}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Typography
                            sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', mb: 0.75 }}
                        >
                            Email address
                        </Typography>
                        <TextField
                            fullWidth
                            type="email"
                            placeholder="you@company.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            onBlur={() => handleBlur('email')}
                            error={!!emailError}
                            helperText={emailError}
                            autoComplete="email"
                            size="small"
                            sx={fieldSx}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5, mb: 0.75 }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>
                                Password
                            </Typography>
                            <Typography
                                component="a"
                                href="#"
                                sx={{
                                    fontSize: '0.8rem',
                                    color: '#6366f1',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Forgot password?
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            onBlur={() => handleBlur('password')}
                            error={!!passwordError}
                            helperText={passwordError}
                            autoComplete="current-password"
                            size="small"
                            sx={fieldSx}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((p) => !p)}
                                            edge="end"
                                            size="small"
                                            tabIndex={-1}
                                            sx={{ color: '#9ca3af', '&:hover': { color: '#374151' } }}
                                        >
                                            {showPassword
                                                ? <VisibilityOff sx={{ fontSize: 18 }} />
                                                : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    size="small"
                                    sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#6366f1' } }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>
                                    Keep me signed in
                                </Typography>
                            }
                            sx={{ mt: 1 }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading || ssoLoading || !isFormValid}
                            sx={{
                                mt: 3,
                                py: 1.25,
                                bgcolor: '#111827',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: 'none',
                                letterSpacing: '0.02em',
                                transition: 'background 0.2s, transform 0.15s',
                                '&:hover': {
                                    bgcolor: '#1f2937',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                    transform: 'translateY(-1px)',
                                },
                                '&:active': { transform: 'translateY(0)' },
                                '&.Mui-disabled': {
                                    bgcolor: '#e5e7eb',
                                    color: '#9ca3af',
                                },
                            }}
                        >
                            {loading
                                ? <CircularProgress size={20} sx={{ color: '#fff' }} />
                                : 'Sign in'}
                        </Button>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                        <Divider sx={{ flex: 1, borderColor: '#e5e7eb' }} />
                        <Typography sx={{ px: 2, fontSize: '0.8rem', color: '#9ca3af' }}>
                            or
                        </Typography>
                        <Divider sx={{ flex: 1, borderColor: '#e5e7eb' }} />
                    </Box>

                    {/* Microsoft SSO Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        disabled={loading || ssoLoading}
                        onClick={handleMicrosoftLogin}
                        sx={{
                            py: 1.25,
                            borderColor: '#e5e7eb',
                            color: '#374151',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            borderRadius: 2,
                            textTransform: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'all 0.2s',
                            '&:hover': {
                                borderColor: '#d1d5db',
                                bgcolor: '#f9fafb',
                                transform: 'translateY(-1px)',
                            },
                            '&:active': { transform: 'translateY(0)' },
                            '&.Mui-disabled': {
                                bgcolor: '#f9fafb',
                                borderColor: '#e5e7eb',
                                color: '#9ca3af',
                            },
                        }}
                    >
                        {ssoLoading ? (
                            <CircularProgress size={20} sx={{ color: '#6366f1' }} />
                        ) : (
                            <>
                                <Box
                                    component="img"
                                    src="https://img.icons8.com/?size=100&id=22989&format=png&color=000000"
                                    alt="Microsoft"
                                    sx={{ width: 20, height: 20 }}
                                />
                                <span>Continue with Microsoft</span>
                            </>
                        )}
                    </Button>

                    {/* Divider hint */}
                    <Typography
                        sx={{
                            mt: 5,
                            textAlign: 'center',
                            fontSize: '0.78rem',
                            color: '#9ca3af',
                        }}
                    >
                        Having trouble? Contact your{' '}
                        <Box
                            component="span"
                            sx={{ color: '#6366f1', fontWeight: 500, cursor: 'pointer' }}
                        >
                            IT administrator
                        </Box>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

/** Clean light-mode TextField */
const fieldSx = {
    '& .MuiOutlinedInput-root': {
        bgcolor: '#fff',
        borderRadius: '10px',
        fontSize: '0.9rem',
        color: '#111827',
        '& fieldset': { borderColor: '#e5e7eb' },
        '&:hover fieldset': { borderColor: '#d1d5db' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: 1.5 },
        '& input::placeholder': { color: '#9ca3af', opacity: 1 },
    },
    '& .MuiFormHelperText-root': {
        fontSize: '0.75rem',
        mt: 0.5,
        ml: 0,
    },
};
