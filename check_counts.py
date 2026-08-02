import json
import sys

def hebrew_letter_to_number(letters):
    values = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
        'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90, 'ק': 100,
        'ר': 200, 'ש': 300, 'ת': 400
    }
    return sum(values.get(char, 0) for char in letters)

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    with open('seif_1_38_raw.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    seif_texts = {}
    for line in lines:
        line = line.strip()
        if not line or line.startswith('סימן'):
            continue
        parts = line.split(' ', 1)
        if len(parts) < 2:
            continue
        seif_num = hebrew_letter_to_number(parts[0])
        seif_texts[seif_num] = parts[1] # Keep the text without the leading letter
        # wait, the JSON might expect the leading letter in hebreu_sans_voyelles?
        # previously: "לט טוב ונכון..."
        # So we should probably keep the prefix!
        seif_texts[seif_num] = line

    with open('public/data/siman_1.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for i, h in enumerate(data['halakhot']):
        seif_str = str(h.get('seif', i+1))
        if not seif_str.isdigit():
            seif_str = str(i+1)
        seif = int(seif_str)
        
        if seif in seif_texts:
            raw_text = seif_texts[seif]
            raw_words = raw_text.split()
            mots = h.get('mots_alignes', [])
            
            print(f"Seif {seif}: raw_words={len(raw_words)}, mots_alignes={len(mots)}")

if __name__ == "__main__":
    main()
