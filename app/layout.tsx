import "./globals.css"
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="eng">
      <body>
        <Header/>
        {children}
        <Footer/>
        
      </body>
    </html>
  );
}
