
import re

file_path = r'e:\mm\ConceptualHero\src\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reverse direction (Swap -1 and 1 targets)
# search for the norm === -1 line and norm === 1 line
p1 = r'if \(norm === -1\) \{ targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; \}'
p2 = r'else if \(norm === 1\) \{ targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; \}'

# Use a complex substitution to swap them
# Actually, let's just use re.sub with groups to preserve indentation
# Norm -1 line
content = re.sub(
    r'^(\s*)if \(norm === -1\) \{ targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; \}',
    r'\1if (norm === 1) { targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }',
    content, flags=re.MULTILINE
)
# Norm 1 line
content = re.sub(
    r'^(\s*)else if \(norm === 1\) \{ targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; \}',
    r'\1else if (norm === -1) { targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }',
    content, flags=re.MULTILINE
)

# 2. Fix the off-screen logic
content = re.sub(
    r'^(\s*)else \{ targetX = \(norm < 0 \? -500 : 500\); targetY = 0; targetScale = 0.30; targetOpacity = 0; \}',
    r'\1else { targetX = (norm > 0 ? -500 : 500); targetY = 0; targetScale = 0.30; targetOpacity = 0; }',
    content, flags=re.MULTILINE
)

# 3. Add isAntipodal and update transition
content = re.sub(
    r'^(\s*)const N = PROJECTS.length;',
    r'\1const N = PROJECTS.length;\n\1const isAntipodal = Math.abs(norm) >= Math.floor(N / 2);',
    content, flags=re.MULTILINE
)

content = re.sub(
    r'^(\s*)transition=\{\{ type: "spring", stiffness: 220, damping: 30 \}\}',
    r'\1transition={isAntipodal ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }}',
    content, flags=re.MULTILINE
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
