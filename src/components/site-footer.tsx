import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/shipping-policy", label: "Shipping Policy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#efe3d1]">
      <div className="content-shell grid gap-10 py-12 md:grid-cols-[1.3fr_0.9fr_0.9fr]">
        <div>
          <p className="font-display text-2xl font-semibold text-[#20303d]">Lovina&apos;s Shop</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-700">
            A Sri Lankan online gift and craft store focused on thoughtful hampers, keepsakes,
            supplies, and packaging that help small celebrations feel special.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a3d2f]">Quick links</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#9a3d2f]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a3d2f]">Store details</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p>Mobile-first gifting and craft experiences for Sri Lankan customers.</p>
            <p>Support: hello@lovinasshop.com</p>
            <p>Instagram and Facebook ready brand experiences.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
