import { Fragment } from "react";
import { AuthLogo } from "@/components/AuthLogo";
import { brandPanel } from "@/data/auth";

export function AuthBrandPanel() {
  return (
    <div className="relative overflow-hidden hidden md:grid md:content-between py-[56px] px-[60px] text-white bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)]">
      <div className="absolute w-[420px] h-[420px] rounded-full bg-[rgba(255,255,255,.12)] -top-[140px] -right-[120px]" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[rgba(255,255,255,.10)] -bottom-[110px] -left-[80px]" />
      <div className="relative">
        <AuthLogo variant="coral" />
      </div>
      <div className="relative">
        <h1 className="font-display font-semibold text-[42px] leading-[1.12] text-white mb-[18px]">
          {brandPanel.headline.split("|").map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h1>
        <p className="text-[17px] leading-[1.6] max-w-[430px] text-[rgba(255,255,255,.92)]">
          {brandPanel.tagline}
        </p>
      </div>
      <div className="relative text-[14px] text-[rgba(255,255,255,.9)]">
        {brandPanel.footer}
      </div>
    </div>
  );
}
