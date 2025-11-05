const Contact = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start py-16 px-6 md:px-20 bg-white gap-10">
        {/* LEFT - CONTACT DETAILS */}
        <div className="bg-gradient-to-b from-blue-700 to-cyan-500 text-white rounded-2xl p-8 md:w-1/2 shadow-lg">
          <p className="uppercase tracking-widest text-sm font-semibold mb-1">
            • Liên hệ •
          </p>

          <div className="space-y-4 text-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-200">Địa chỉ:</p>
              <p className="text-lg">
                123 Đinh Tiên Hoàng, phường Đa Kao, Quận 1, TP. Hồ Chí Minh.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-200">Email:</p>
              <p className="text-lg">organicfood@hotro.com</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-200">Điện thoại:</p>
              <p className="text-lg">+1-800-456-478-23</p>
            </div>
          </div>
        </div>

        {/* RIGHT - CONTACT FORM */}
        <div className="md:w-1/2">
          <p className="uppercase tracking-widest text-sm font-semibold text-gray-500 mb-1">
            • Liên hệ •
          </p>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Sẵn sàng để bắt đầu chưa?
          </h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name *"
              className="w-full border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <br />
            <input
              type="email"
              placeholder="Your Email *"
              className="w-full border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <textarea
              placeholder="Message..."
              className="w-full border rounded-2xl px-5 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold !rounded-full px-8 py-3 shadow-md transition-all duration-300 flex items-center gap-2"
            >
              Send Message
              <span className="text-lg">→</span>
            </button>
          </form>
        </div>
      </div>
      <div className="w-full">
        <iframe
          style={{ width: "100%" }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.269550451818!2d106.69443407451732!3d10.79065525893216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cadfe652cf%3A0xaaef503bbdc780a9!2zMTIzIMSQaW5oIFRpw6puIEhvw6BuZywgxJBhIEthbywgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCAxMDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1761862939322!5m2!1svi!2s"
          width="600"
          height="450"
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
};

export default Contact;
