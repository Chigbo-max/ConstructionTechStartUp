import bgImage from "../../assets/contact.jpeg";
import { motion } from "framer-motion";

const Contact = () => {


  return (
    <div className="w-full">
      <section className="relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 sm:pt-24 md:pt-32">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(rgba(17, 24, 38, 0.9), rgba(17, 24, 38, 0.9)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
          <motion.h1
            initial={{ x: "-100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 drop-shadow-lg leading-tight mx-auto"
          >
            <span className="text-amber-400">Contact</span> Us
          </motion.h1>
          <motion.p
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 mx-auto drop-shadow leading-relaxed max-w-4xl"
          >
            Do you have questions about how to take our resources into your community? Do you have a topic suggestion? Do you want to know more about how you can engage further in the faith and work space in your region or are there other initiatives that you want us to know about? Please get in touch!
          </motion.p>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <section id="contact" className="py-12 bg-white rounded-2xl shadow-xl">

            <div className="flex-1 flex flex-col gap-8">

              <div className="flex flex-col items-center w-full text-center bg-gray-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Nigeria Data Protection Regulation (NDPR), 2019</h3>
                <p className="text-gray-700 max-w-xl mx-auto">
                  We are committed to protecting your privacy. Whenever you use our website, complete an application form or contact us electronically, you consent to our processing of your personal information in accordance with the requirements of NDPR. In the event that you wish to revoke your consent, please send an email to cprofessionalsnetwork@gmail.com.
                </p>
              </div>
            </div>
          </section>
        </div>

      </div >
    </div >
  );
};

export default Contact;




