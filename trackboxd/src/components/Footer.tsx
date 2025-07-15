"use client";

type FooterProps = {
  variant?: "dark" | "light";
};

const Footer = ({ variant = "dark" }: FooterProps) => {
  const isDark = variant === "dark";

  const bgColor = isDark ? "bg-[#0C3B2E]" : "bg-[#F9F9F9]";
  const textColor = isDark ? "text-[#F9F9F9]/60" : "text-[#1F2C24]/60";
  const hoverColor = isDark ? "hover:text-[#FFBA00]" : "hover:text-[#6D9773]";
  const borderColor = isDark ? "border-[#F9F9F9]/10" : "border-[#D9D9D9]/50";

  return (
    <footer className={`px-6 py-8 relative ${bgColor} z-10 border-t ${borderColor}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className={`${textColor} text-sm`}>
            © 2024 Trackboxd. For music lovers, by music lovers.
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
