"use client";

const Footer = () => {
    return (
    <footer className="px-6 py-8 relative z-10 border-t border-[#F9F9F9]/10">
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-[#F9F9F9]/60 text-sm">
                    © 2024 Trackboxd. For music lovers, by music lovers.
                </div>
                <div className="flex gap-6 text-sm">
                    {["About", "Privacy", "Contact"].map((item, index) => (
                        <a
                            key={index}
                            href={`#${item.toLowerCase()}`}
                            className="text-[#F9F9F9]/60 hover:text-[#FFBA00] transition-colors duration-200">
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
    )
};

export default Footer;
