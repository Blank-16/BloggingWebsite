export default function Footer() {
    return (
        <>
        <hr className="border border-slate-500" />
            <footer className="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-black text-white/70">
                <p className="">
                  <a href="https://github.com/Blank-16" target="blank">@Blank</a>
                </p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-white transition-all">
                        Contact Us
                    </a>
                    <div className="h-8 w-px bg-white/20"></div>
                    <a href="#" className="hover:text-white transition-all">
                        Privacy Policy
                    </a>
                    <div className="h-8 w-px bg-white/20"></div>
                    <a href="#" className="hover:text-white transition-all">
                        Trademark Policy
                    </a>
                </div>
            </footer>
        </>
    );
};