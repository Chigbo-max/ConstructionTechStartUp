import { useDispatch } from "react-redux"; 
import { openModal } from "../../features/ui/uiSlice";
import HeroImage from "../../assets/hero-img.png";
import ActionImage from "../../assets/blueHelmet.jpeg";
import Testimonial from "../../assets/yellowHelmet.jpeg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faClock, faChartLine } from "@fortawesome/free-solid-svg-icons";

const Landing = () => {
  const dispatch = useDispatch();

  return (
    <div className="px-6 md:px-12">
      {/* Wrapper Container for centralization */}
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[80vh]">
          <div className="text-left md:w-1/2 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build better with
              <span className="text-primary-500"> Smart Construction</span> Management
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              Connect with qualified contractors, manage your construction projects,
              and track progress in real-time with our comprehensive platform for
              modern construction management.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => dispatch(openModal("register"))}
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => (window.location.href = "/about")}
                className="border border-primary-500 text-primary-500 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
            <img
              src={HeroImage}
              alt="Smart construction management"
              className="max-w-md w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-16 text-center">
          <div>
            <h1 className="text-4xl font-bold text-primary-500">500+</h1>
            <p className="text-gray-700">Projects Completed</p>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary-500">100+</h1>
            <p className="text-gray-700">Contractors Registered</p>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-primary-500">98%</h1>
            <p className="text-gray-700">Success Rate</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            We simplify construction project management with tools designed to save
            time, cut costs, and ensure top-quality results.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <FontAwesomeIcon icon={faUsers} className="text-primary-500 text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Seamless Collaboration</h3>
              <p className="text-gray-600">
                Bring together contractors, homeowners, and teams for smooth
                communication.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <FontAwesomeIcon icon={faClock} className="text-primary-500 text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Stay on top of deadlines and budgets with live project updates.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <FontAwesomeIcon icon={faChartLine} className="text-primary-500 text-5xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
              <p className="text-gray-600">
                Get reports and analytics that help optimize your construction
                processes.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Clients Say</h2>
          <div className="bg-white shadow-md rounded-xl p-8 max-w-3xl mx-auto">
            <img
              src={Testimonial}
              alt="Client"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <p className="italic text-gray-700 mb-4">
              “This platform completely transformed how we manage our projects.
              Everything is transparent, efficient, and stress-free.”
            </p>
            <h4 className="font-semibold text-gray-900">— Abdul Majek, Homeowner</h4>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 mb-20 bg-primary-500 text-white rounded-xl p-12 flex flex-col md:flex-row items-center justify-between">
          {/* Left Text */}
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="mb-8 text-lg">
              Join thousands of contractors and homeowners building smarter with us.
            </p>
            <button
              onClick={() => (window.location.href = "/register")}
              className="bg-white text-primary-500 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Sign Up Today
            </button>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={ActionImage}
              alt="Ready to start"
              className="max-w-sm w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
