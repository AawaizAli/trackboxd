"use client";

type FooterProps = {
  variant?: "dark" | "light";
};

const Footer = ({ variant = "dark" }: FooterProps) => {
  const isDark = variant === "dark";

  const bgColor = isDark ? "bg-[#5C5537]" : "bg-[#FFFBEb]";
  const textColor = isDark ? "text-[#FFFBEb]/70" : "text-[#5C5537]/70";
  const hoverColor = isDark ? "hover:text-[#FFFBEb]" : "hover:text-[#5C5537]";
  const borderColor = isDark ? "border-[#FFFBEb]/20" : "border-[#5C5537]/20";

  return (
    <footer className={`px-6 py-8 relative ${bgColor} z-10 border-t ${borderColor}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`${textColor} text-sm`}>
            © 2025 Trackboxd. Made with love 🤎
          </div>
          <div className="flex gap-6 text-sm">
            {["About", "Privacy", "Contact"].map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className={`${textColor} ${hoverColor} transition-colors duration-200`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;