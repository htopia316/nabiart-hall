const THEME_SCRIPT = `
(function(){
  try {
    var s = JSON.parse(localStorage.getItem('nabiart-theme') || '{}');
    var t = s.state && s.state.theme;
    if (t === 'dark') document.documentElement.classList.add('dark');
    else if (t === 'light') document.documentElement.classList.remove('dark');
    else if (window.matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.classList.add('dark');
  } catch(e){}
})()
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
