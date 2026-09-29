import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_banner():
    width = 1200
    height = 630
    
    # 1. Base Mandap Background
    bg_path = 'public/client-images/mandap-beach.jpg'
    if not os.path.exists(bg_path):
        bg_path = 'public/client-images/mandap.jpg'
    
    bg = Image.open(bg_path).convert('RGBA')
    
    # Resize & crop background to fill 1200x630
    bg_ratio = bg.width / bg.height
    target_ratio = width / height
    if bg_ratio > target_ratio:
        new_w = int(height * bg_ratio)
        bg = bg.resize((new_w, height), Image.Resampling.LANCZOS)
        left = (new_w - width) // 2
        bg = bg.crop((left, 0, left + width, height))
    else:
        new_h = int(width / bg_ratio)
        bg = bg.resize((width, new_h), Image.Resampling.LANCZOS)
        top = (new_h - height) // 2
        bg = bg.crop((0, top, width, top + height))

    # Apply soft blur for photographic depth
    bg_blurred = bg.filter(ImageFilter.GaussianBlur(radius=2))

    # 2. Add Dark Warm Vignette / Gradient Overlay
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)
    
    for x in range(width):
        t = x / width
        alpha = int(130 + 50 * t)
        draw_ov.line([(x, 0), (x, height)], fill=(28, 8, 14, alpha))
    
    composite = Image.alpha_composite(bg_blurred, overlay)
    draw = ImageDraw.Draw(composite)

    # 3. Outer & Inner Gold Borders
    gold = (212, 175, 55, 255)
    bright_gold = (255, 223, 110, 255)
    deep_gold = (180, 140, 35, 255)
    
    draw.rectangle([20, 20, width - 20, height - 20], outline=gold, width=2)
    draw.rectangle([26, 26, width - 26, height - 26], outline=deep_gold, width=1)

    corners = [(23, 23), (width - 23, 23), (23, height - 23), (width - 23, height - 23)]
    for cx, cy in corners:
        draw.rectangle([cx - 4, cy - 4, cx + 4, cy + 4], fill=bright_gold)

    # 4. Load Fonts
    font_dir = 'C:/Windows/Fonts'
    try:
        f_mantra = ImageFont.truetype(os.path.join(font_dir, 'georgia.ttf'), 15)
        f_invite_title = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 18)
        f_names = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 50)
        f_date = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 26)
        f_time = ImageFont.truetype(os.path.join(font_dir, 'georgia.ttf'), 18)
        f_venue = ImageFont.truetype(os.path.join(font_dir, 'georgiai.ttf'), 16)
        f_btn = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 14)
        f_card_name = ImageFont.truetype(os.path.join(font_dir, 'georgiab.ttf'), 17)
        f_card_role = ImageFont.truetype(os.path.join(font_dir, 'georgiai.ttf'), 13)
    except Exception as e:
        print('Font error:', e)
        f_mantra = f_invite_title = f_names = f_date = f_time = f_venue = f_btn = f_card_name = f_card_role = ImageFont.load_default()

    # 5. Couple Cards on Left Side
    card_w = 195
    card_h = 425
    card_top = 100
    card_gap = 22
    start_x = 55

    def draw_portrait_card(photo_path, name_text, role_text, left_x, top_y, crop_box=None):
        card_img = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
        card_draw = ImageDraw.Draw(card_img)

        card_draw.rounded_rectangle([0, 0, card_w, card_h], radius=18, fill=(28, 6, 12, 235), outline=gold, width=2)
        card_draw.rounded_rectangle([3, 3, card_w - 3, card_h - 3], radius=15, outline=deep_gold, width=1)

        photo_h = card_h - 75
        raw_photo = Image.open(photo_path).convert('RGB')
        if crop_box:
            raw_photo = raw_photo.crop(crop_box)
        
        p_ratio = raw_photo.width / raw_photo.height
        target_p_ratio = (card_w - 12) / (photo_h - 12)
        if p_ratio > target_p_ratio:
            nh = photo_h - 12
            nw = int(nh * p_ratio)
            scaled = raw_photo.resize((nw, nh), Image.Resampling.LANCZOS)
            sx = (nw - (card_w - 12)) // 2
            cropped = scaled.crop((sx, 0, sx + (card_w - 12), nh))
        else:
            nw = card_w - 12
            nh = int(nw / p_ratio)
            scaled = raw_photo.resize((nw, nh), Image.Resampling.LANCZOS)
            sy = max(0, (nh - (photo_h - 12)) // 6)
            cropped = scaled.crop((0, sy, nw, sy + (photo_h - 12)))

        mask = Image.new('L', (card_w - 12, photo_h - 12), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, card_w - 12, photo_h - 12], radius=12, fill=255)
        
        card_img.paste(cropped, (6, 6), mask)
        card_draw.rounded_rectangle([6, 6, card_w - 6, photo_h], radius=12, outline=deep_gold, width=1)

        bbox_n = card_draw.textbbox((0, 0), name_text, font=f_card_name)
        nw = bbox_n[2] - bbox_n[0]
        nx = (card_w - nw) // 2
        card_draw.text((nx, photo_h + 12), name_text, fill=(255, 235, 175), font=f_card_name)

        bbox_r = card_draw.textbbox((0, 0), role_text, font=f_card_role)
        rw = bbox_r[2] - bbox_r[0]
        rx = (card_w - rw) // 2
        card_draw.text((rx, photo_h + 36), role_text, fill=(212, 175, 55), font=f_card_role)

        composite.paste(card_img, (left_x, top_y), card_img)

    bride_img_path = 'public/client-images/bride.jpg'
    b_raw = Image.open(bride_img_path)
    b_box = (int(b_raw.width * 0.08), int(b_raw.height * 0.13), int(b_raw.width * 0.92), int(b_raw.height * 0.82))
    draw_portrait_card(bride_img_path, 'Inchara Shetty', 'The Bride', start_x, card_top, b_box)

    groom_img_path = 'public/client-images/groom.jpg'
    g_raw = Image.open(groom_img_path)
    g_box = (int(g_raw.width * 0.15), int(g_raw.height * 0.08), int(g_raw.width * 0.85), int(g_raw.height * 0.65))
    draw_portrait_card(groom_img_path, 'Kalyan Reddy', 'The Groom', start_x + card_w + card_gap, card_top, g_box)

    # 6. Right Side Invitation Content
    col_left = start_x + (card_w * 2) + card_gap + 20
    col_right = width - 40
    center_x = (col_left + col_right) // 2
    cur_y = 90

    draw = ImageDraw.Draw(composite)

    def draw_centered_text(text, y, font, fill, shadow_color=None):
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        tx = center_x - (tw // 2)
        if shadow_color:
            draw.text((tx + 1, y + 1), text, font=font, fill=shadow_color)
        draw.text((tx, y), text, font=font, fill=fill)
        return bbox[3] - bbox[1]

    draw_centered_text('||  OM SRI GANESHAYA NAMAHA  ||', cur_y, f_mantra, (255, 230, 140, 255), (0, 0, 0, 180))
    cur_y += 32

    draw_centered_text('WEDDING INVITATION', cur_y, f_invite_title, (230, 190, 80, 255), (0, 0, 0, 200))
    cur_y += 34

    rule_w = 340
    rule_x1 = center_x - (rule_w // 2)
    rule_x2 = center_x + (rule_w // 2)
    draw.line([(rule_x1, cur_y), (rule_x2, cur_y)], fill=(212, 175, 55, 220), width=1)
    draw.polygon([(center_x, cur_y - 4), (center_x + 5, cur_y), (center_x, cur_y + 4), (center_x - 5, cur_y)], fill=bright_gold)
    cur_y += 24

    draw_centered_text('Inchara & Kalyan', cur_y, f_names, (255, 252, 240, 255), (0, 0, 0, 220))
    cur_y += 76

    draw_centered_text('Friday, 30 October 2026', cur_y, f_date, (255, 225, 115, 255), (0, 0, 0, 200))
    cur_y += 42

    draw_centered_text('Muhurtham at 10:00 AM IST', cur_y, f_time, (245, 235, 220, 230), (0, 0, 0, 180))
    cur_y += 34

    draw_centered_text('ANASUYA  •  Kapu, Karnataka', cur_y, f_venue, (220, 195, 140, 220), (0, 0, 0, 180))
    cur_y += 50

    btn_w = 390
    btn_h = 48
    btn_x1 = center_x - (btn_w // 2)
    btn_y1 = cur_y
    btn_x2 = btn_x1 + btn_w
    btn_y2 = btn_y1 + btn_h

    draw.rounded_rectangle([btn_x1, btn_y1, btn_x2, btn_y2], radius=24, fill=(138, 16, 38, 240), outline=gold, width=2)
    draw.rounded_rectangle([btn_x1 + 2, btn_y1 + 2, btn_x2 - 2, btn_y2 - 2], radius=22, outline=bright_gold, width=1)

    btn_text = 'TAP TO OPEN INVITATION & RSVP'
    bbox_b = draw.textbbox((0, 0), btn_text, font=f_btn)
    bw = bbox_b[2] - bbox_b[0]
    bh = bbox_b[3] - bbox_b[1]
    bx = center_x - (bw // 2)
    by = btn_y1 + ((btn_h - bh) // 2) - 2
    draw.text((bx + 1, by + 1), btn_text, font=f_btn, fill=(0, 0, 0, 180))
    draw.text((bx, by), btn_text, font=f_btn, fill=(255, 250, 235, 255))

    final_img = composite.convert('RGB')
    out_path = 'public/client-images/social-thumbnail.jpg'
    final_img.save(out_path, 'JPEG', quality=95, optimize=True)
    # Also save as png for crystal clear metadata
    png_path = 'public/client-images/social-thumbnail.png'
    final_img.save(png_path, 'PNG', optimize=True)
    print(f'Metadata banners created successfully at: {out_path} and {png_path}')

if __name__ == '__main__':
    create_banner()
