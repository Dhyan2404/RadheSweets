from PIL import Image

im = Image.open(r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg')
w, h = im.size

print(f"Total image dimensions: width={w}, height={h}")

# Let's count columns by checking across the top row (e.g. at y = 50)
# Look at the image:
# Row 1:
# 1. Kaju Katli (diamond)
# 2. Gulab Jamun (dark brown balls)
# 3. Rasgulla (white balls in bowl)
# 4. Rasmalai (yellow milk with pistachio)
# 5. Jalebi (orange pretzel spirals)
# 6. Motichoor Ladoo (orange boondi balls)
# 7. Besan Ladoo (golden balls)
# 8. Kalakand (square white/cream crumbly)
# 9. Peda (round cream with pistachio)
# 10. Mysore Pak (yellow squares)
# That's 10 columns!

# Let's count rows:
# Let's check 10 rows or 11 rows:
# 1024 / 10 = 102.4 pixels per cell if 10x10.
# If 10x11, 1024 / 11 = 93.09 pixels per row.
# Let's check how many rows there are.
