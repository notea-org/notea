import pkg from 'package.json'

export const SettingFooter = () => {
  return (
    <footer className="mt-20 text-center opacity-50 text-xs">
      <div>
        <a
          href="https://github.com/qingwei-li/notea"
          target="_blank"
          rel="noreferrer"
        >
          Notea v{pkg.version}
        </a>
      </div>
      <div className="space-x-1">
        <span>MIT</span>
        <span>&copy;</span>
        <a href="//github.com/qingwei-li" target="_blank" rel="noreferrer">
          Cinwell
        </a>
      </div>
      <style jsx>{`
        a {
          font-weight: normal;
        }
      `}</style>
    </footer>
  )
}
