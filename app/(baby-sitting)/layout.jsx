import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}