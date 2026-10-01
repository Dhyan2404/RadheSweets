import re

data_path = r'd:\Dhyan\websites\RadheSweets\src\data.js'
with open(data_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to replace image for each sweet sw-X
def replacer(match):
    full_block = match.group(0)
    sweet_id = match.group(1)
    # Replace image: "./assets/100_mithais_grid.png" with "/assets/sweets/sw-X.png"
    updated_block = re.sub(
        r'"image":\s*"[^"]*"',
        f'"image": "/assets/sweets/{sweet_id}.png"',
        full_block
    )
    return updated_block

# Regex to match each sweet object
pattern = re.compile(r'\{[^{}]*"id":\s*"(sw-\d+)"[^{}]*\}', re.DOTALL)
new_content = pattern.sub(replacer, content)

with open(data_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated sweet images in src/data.js to individual cropped image paths!")
