import Editor from 'rich-markdown-editor';

const IndexPage = () => (
  <div>
    <Editor
      onChange={() => {}}
      embeds={[
        {
          title: 'Google Doc',
          keywords: 'google docs gdocs',
          icon: () => <div>google</div>,
          matcher: (href) => {
            console.log(href);
            return true;
          },
          component: () => <div>aaaa</div>
        }
      ]}
      onCreateLink={async (title) => {
        return title;
      }}
    />
  </div>
);

export default IndexPage;
