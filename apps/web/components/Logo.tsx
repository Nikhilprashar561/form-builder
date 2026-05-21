"use client";

import Image from "next/image";

interface LogoProps {
  onClick?: () => void;
}

const Logo = ({ onClick }: LogoProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-2 border-0 bg-transparent"
    >
      <span className="font-display mt-4 text-xl font-bold tracking-tight text-black">
        <Image src="/logo.png" alt="Logo" width={270} height={80} />
      </span>
    </button>
  );
};

export default Logo;
