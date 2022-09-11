import pkg from 'package.json';

export const SettingFooter = () => {
    return (
        <footer className="mt-20 text-center opacity-50 text-xs">
            <div>
                <a
                    href="https://github.com/notea-org/notea"
                    target="_blank"
                    rel="noreferrer"
                >
                    Notea v{pkg.version}
                </a>
            </div>
            <div className="space-x-1">
                <span>MIT &copy;</span>
                <a
                    href="https://github.com/notea-org/notea"
                    target="_blank"
                    rel="noreferrer"
                >
                    Notea Contributors
                </a>
                <span>2022</span>
            </div>
        </footer>
    );
};
