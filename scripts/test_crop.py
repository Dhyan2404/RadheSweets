from PIL import Image
import os

im = Image.open(r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg')
w, h = im.size

out_dir = r'd:\Dhyan\websites\RadheSweets\public\assets\cropped_test'
os.makedirs(out_dir, exist_ok=True)

# Test 10x10 grid:
# If 10x10, each cell is 1024 / 10 = 102.4
print("Saving 10x10 test crops...")
for r in range(10):
    for c in range(10):
        left = int(c * 102.4)
        top = int(r * 102.4)
        right = int((c + 1) * 102.4)
        bottom = int((r + 1) * 102.4)
        crop = im.crop((left, top, right, bottom))
        if c == 0:
            crop.save(os.path.join(out_dir, f"test_r{r}_c{c}.png"))

print("Saved row test crops for c=0 (left column)")
