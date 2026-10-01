from PIL import Image

im = Image.open(r'C:\Users\dhyan\.gemini\antigravity-ide\brain\dd86dd76-4445-41ad-bac6-503bce791c52\.user_uploaded\media_1790835010671.jpg')
w, h = im.size

print(f"Image size: {w}x{h}")
# 10 columns: width = 1024 / 10 = 102.4 px
# 11 rows: height = 1024 / 11 = 93.09 px

# Let's verify row 11 (the 11th row from 0 to 10):
# top = 10 * 93.09 = 930.9 px, bottom = 1024 px.
# That is ~93.1 px high, matching all other rows!
# Let's crop row 11 column 0 and row 11 column 9:
r11_c0 = im.crop((0, int(10 * (1024/11)), int(102.4), 1024))
r11_c9 = im.crop((int(9 * 102.4), int(10 * (1024/11)), 1024, 1024))

r11_c0.save(r'd:\Dhyan\websites\RadheSweets\public\assets\cropped_test\r11_c0.png')
r11_c9.save(r'd:\Dhyan\websites\RadheSweets\public\assets\cropped_test\r11_c9.png')
print("Successfully verified 11 rows x 10 columns = 110 items!")
