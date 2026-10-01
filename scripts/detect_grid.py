from PIL import Image
import numpy as np

im = Image.open(r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg').convert('L')
arr = np.array(im)

# Look at row averages and column averages or gradient to find borders
# Notice the grid has borders/lines
print(f"Image array shape: {arr.shape}")

# Let's count visual items along x at y=45:
# and along y at x=50:
row_diff = np.abs(np.diff(arr, axis=0)).mean(axis=1)
col_diff = np.abs(np.diff(arr, axis=1)).mean(axis=0)

# Check candidate number of rows: 10, 11, 12?
for n_rows in range(8, 14):
    cell_h = 1024 / n_rows
    print(f"Testing {n_rows} rows: cell_height = {cell_h:.2f}px")

for n_cols in range(8, 14):
    cell_w = 1024 / n_cols
    print(f"Testing {n_cols} cols: cell_width = {cell_w:.2f}px")
