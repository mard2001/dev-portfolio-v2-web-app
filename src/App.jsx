import gsap from "gsap/all"
import Navbar from "./layout/Navbar"
import About from "./sections/About"
import Contact from "./sections/Contact"
import Experience from "./sections/Experience"
import Footer from "./sections/Footer"
import Hero from "./sections/Hero"
import Projects from "./sections/Projects"
import Technologies from "./sections/Technologies"
import Testimony from "./sections/Testimony"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Animate from "./sections/Animate"

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Technologies />
        <About />
        <Experience />
        <Projects />
        <Testimony />
        <Animate />
        {/* <Contact /> */}
        <Footer />
      </main>
    </div>
  )
}

export default App
