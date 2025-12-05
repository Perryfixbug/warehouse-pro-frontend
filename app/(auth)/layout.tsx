import RecaptchaProvider from '@/app/context/recaptcha-provider'
import '@/app/globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <RecaptchaProvider>
        {children}
      </RecaptchaProvider>
    </div>
  )
}
