from PIL import Image
import numpy as np

im = Image.open(r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg').convert('L')
arr = np.array(im)

# Look at horizontal gradients across the entire image:
diffs = []
for y in range(1, 1023):
    diffs.append((y, float(np.mean(np.abs(arr[y, :].astype(float) - arr[y-1, :].astype(float))))))

print("Top horizontal gradient lines:")
diffs.sort(key=lambda x: x[1], reverse=True)
candidate_y = [y for y, val in diffs[:40]]
candidate_y.sort()

# Group close y coordinates
borders = []
for y in candidate_y:
    if not borders or y - borders[-1] > 20:
        borders.append(y)

print("Detected row borders:", borders)

# Also check column borders along x:
col_diffs = []
for x in range(1, 1023):
    col_diffs.append((x, float(np.mean(np.abs(arr[:, x].astype(float) - arr[:, x-1].astype(float))))))

col_diffs.sort(key=lambda x: x[1], reverse=True)
candidate_x = [x for x, val in col_diffs[:40]]
candidate_x.sort()
col_borders = []
for x in candidate_x:
    if not col_borders or x - col_borders[-1] > 20:
        col_borders.append(x)

print("Detected col borders:", col_borders)
