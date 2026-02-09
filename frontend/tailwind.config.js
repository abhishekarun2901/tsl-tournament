/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eafaf1',
                    100: '#d5f5e3',
                    200: '#abebc6',
                    300: '#82e0aa',
                    400: '#58d68d',
                    500: '#2ecc71',
                    600: '#27ae60',
                    700: '#1e8449',
                    800: '#186a3b',
                    900: '#0e5027'
                },
                secondary: {
                    50: '#e8ecff',
                    100: '#c6d0ff',
                    200: '#9eadff',
                    300: '#768aff',
                    400: '#4d67ff',
                    500: '#1f4fff',
                    600: '#1a42d9',
                    700: '#1435b3',
                    800: '#0f288c',
                    900: '#0a1b66'
                },
                surface: {
                    50: '#ffffff',
                    100: '#fafbfc',
                    200: '#f5f7fa',
                    300: '#e8ecf1',
                    400: '#d1d9e6',
                    500: '#b4c0d4'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif']
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
                'glow': '0 0 20px rgba(46, 204, 113, 0.3)'
            },
            animation: {
                'pulse-live': 'pulse-live 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.3s ease-out',
                'fade-in': 'fade-in 0.3s ease-out'
            },
            keyframes: {
                'pulse-live': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 }
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                }
            }
        },
    },
    plugins: [],
}
