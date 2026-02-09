function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="font-display font-bold text-sm">TSL</span>
                        </div>
                        <div>
                            <p className="font-display font-bold">Thekkinkad Super League</p>
                            <p className="text-gray-400 text-sm">Local Football Tournament</p>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Thekkinkad Super League. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
