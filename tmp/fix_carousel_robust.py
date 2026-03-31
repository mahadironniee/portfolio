
import re

file_path = r'e:\mm\ConceptualHero\src\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Reverse direction (Swap -1 and 1 targets)
content = content.replace(
    'if (norm === -1) { targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }',
    'if (norm === 1) { targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }'
)
# Note: I need to be careful not to replace the same thing twice.
# Using a more unique temporary placeholder.
content = content.replace(
    'else if (norm === 1) { targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }',
    'else if (norm === -1) { targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }'
)

# 2. Fix the off-screen logic
content = content.replace(
    'else { targetX = (norm < 0 ? -500 : 500); targetY = 0; targetScale = 0.30; targetOpacity = 0; }',
    'else { targetX = (norm > 0 ? -500 : 500); targetY = 0; targetScale = 0.30; targetOpacity = 0; }'
)

# 3. Add isAntipodal and update transition
# Finding the place where N is defined
if 'const N = PROJECTS.length;' in content:
    content = content.replace(
        'const N = PROJECTS.length;',
        'const N = PROJECTS.length;\n                const isAntipodal = Math.abs(norm) >= Math.floor(N / 2);'
    )

content = content.replace(
    'transition={{ type: "spring", stiffness: 220, damping: 30 }}',
    'transition={isAntipodal ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }}'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
