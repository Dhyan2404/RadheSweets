import os
from PIL import Image

image_path = r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg'
out_dir = r'd:\Dhyan\websites\RadheSweets\public\assets\sweets'
os.makedirs(out_dir, exist_ok=True)

im = Image.open(image_path)

# Exact detected boundaries from pixel edge analysis:
row_lines = [0, 92, 190, 288, 385, 481, 578, 675, 770, 865, 960]
col_lines = [0, 102, 205, 307, 409, 511, 613, 715, 818, 921, 1024]

count = 0
for r in range(10):
    for c in range(10):
        index = r * 10 + c + 1
        
        top = row_lines[r] + 2
        bottom = row_lines[r + 1] - 2
        left = col_lines[c] + 2
        right = col_lines[c + 1] - 2

        cropped = im.crop((left, top, right, bottom))
        # Resize to 256x256 high-resolution square
        resized = cropped.resize((256, 256), Image.Resampling.LANCZOS)

        filename = f"sw-{index}.png"
        filepath = os.path.join(out_dir, filename)
        resized.save(filepath, "PNG", optimize=True)
        count += 1

print(f"Cropped {count} sweet images with exact pixel boundaries into {out_dir}")
