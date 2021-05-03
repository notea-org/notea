import useI18n from 'libs/web/hooks/use-i18n'
import pkg from 'package.json'

export const SettingFooter = () => {
  const { t } = useI18n()

  return (
    <footer className="mt-20 text-center opacity-50">
      <div className="mr-4">
        <span>{t('Current version')}:</span>
        <a
          className="ml-1"
          href="//github.com/qingwei-li/notea/tags"
          target="_blank"
          rel="noreferrer"
        >
          v{pkg.version}
        </a>
      </div>

      <div>
        <span>&copy;</span>
        <a
          className="ml-1"
          href="//github.com/qingwei-li"
          target="_blank"
          rel="noreferrer"
        >
          Cinwell
        </a>
      </div>
    </footer>
  )
}
