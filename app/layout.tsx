import "./globals.css"
import Header from "./components/header/header";
import Footer from "./components/footer/footer";


export const dynamic = "force-dynamic"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Header/>
        {children}
        <Footer/>
        
      </body>
    </html>
  );
}
