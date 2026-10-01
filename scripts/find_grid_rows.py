from PIL import Image
import numpy as np

im = Image.open(r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg')
arr = np.array(im)

# Let's count how many distinct dish centers there are along y
# Look at column 0 (x between 20 and 80):
col0_profile = arr[:, 40:60, :].mean(axis=(1, 2))

# Let's print out the row image crops for 11 rows as well
out_dir = r'd:\Dhyan\websites\RadheSweets\public\assets\cropped_test'
for n in [10, 11, 12]:
    h_cell = 1024 / n
    w_cell = 1024 / 10
    crop = im.crop((0, int((n-1)*h_cell), int(w_cell), 1024))
    crop.save(os.path.join(out_dir, f"bottom_left_{n}rows.png"))

print("Bottom-left crops saved for 10, 11, 12 rows.")
