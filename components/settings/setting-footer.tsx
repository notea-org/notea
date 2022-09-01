import pkg from 'package.json';

export const SettingFooter = () => {
    return (
        <footer className="mt-20 text-center opacity-50 text-xs">
            <div>
                <a
                    href="https://github.com/tecc/notea"
                    target="_blank"
                    rel="noreferrer"
                >
                    Notea v{pkg.version}
                </a>
            </div>
            <div className="space-x-1">
                <span>MIT &copy;</span>
                <a href="https://github.com/qingwei-li" target="_blank" rel="noreferrer">
                    Cinwell
                </a>
                <span>2021-2022</span>
            </div>
            <div className="space-x-1">
                <span>MIT &copy;</span>
                <a href="https://tecc.me">tecc</a>
                <span>2022</span>
            </div>
        </footer>
    );
};
