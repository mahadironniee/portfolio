
import sys

file_path = r'e:\mm\ConceptualHero\src\app\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Reverse targetX logic (Lines 622-625)
# Note: lines are 0-indexed in Python, so line 622 is index 621.
lines[621] = '                if (norm === 1) { targetX = -153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }\n'
lines[622] = '                else if (norm === 0) { targetX = 0; targetY = 0; targetScale = 0.75; targetOpacity = 1.00; }\n'
lines[623] = '                else if (norm === -1) { targetX = 153; targetY = 22; targetScale = 0.45; targetOpacity = 0.78; }\n'
lines[624] = '                else { targetX = (norm > 0 ? -500 : 500); targetY = 0; targetScale = 0.30; targetOpacity = 0; }\n'

# Add isAntipodal check before line 627 (index 626)
lines.insert(626, '                const isAntipodal = Math.abs(norm) >= Math.floor(N / 2);\n')

# Update transition (Old line 631 is now 632 because of the insertion)
lines[631] = '                    transition={isAntipodal ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 30 }}\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
