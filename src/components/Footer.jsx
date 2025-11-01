export default function Footer() {
    return (
        <>
        <hr className="border border-slate-500" />
            <footer className="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-black text-white/70">
                <p className="hover:text-white transition-all cursor-pointer">
                  <a href="https://github.com/Blank-16" target="blank">@Blank-16</a>
                </p>
                <div className="flex items-center gap-4">
                    <p className="hover:text-white transition-all cursor-text">
                    Please be respectful with your posts.
                    </p>
                </div>
            </footer>
        </>
    );
};