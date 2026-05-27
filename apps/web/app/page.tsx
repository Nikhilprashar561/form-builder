import NexFormLanding from "~/components/Landing";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default async function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <NexFormLanding />
        {/* <LandingPage /> */}
      </main>
      <Footer />
    </div>
  );
}
