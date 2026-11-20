with open('src/index.css', 'r') as f:
    content = f.read()

font_face = """@font-face {
  font-family: 'Ethnocentric';
  src: url('/fonts/Ethnocentric.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

"""

if '@font-face' not in content:
    content = font_face + content

if '--font-ethnocentric' not in content:
    content = content.replace('--font-display: "Space Grotesk"', '--font-ethnocentric: "Ethnocentric", ui-sans-serif, system-ui, sans-serif;\n  --font-display: "Space Grotesk"')

with open('src/index.css', 'w') as f:
    f.write(content)
