import json
import re
import sys

def hebrew_letter_to_number(letters):
    values = {'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
              'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90, 'ק': 100,
              'ר': 200, 'ש': 300, 'ת': 400}
    # ignore non-hebrew letters
    cleaned = ''.join(c for c in letters if c in values)
    return sum(values.get(char, 0) for char in cleaned)

def clean_brackets(text):
    # Remove anything inside square brackets
    text = re.sub(r'\[.*?\]', '', text)
    # Also clean up extra spaces
    text = ' '.join(text.split())
    return text

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    with open('seif_1_38_raw.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    with open('public/data/siman_1.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for line in lines:
        line = line.strip()
        if not line or line.startswith('סימן'): continue
        parts = line.split(' ', 1)
        if len(parts) < 2: continue
        
        seif = hebrew_letter_to_number(parts[0])
        raw_text = line
        
        # User wants to update "hebreu_sans_voyelles" with the raw_text.
        # But wait, should we include the bracketed text in "hebreu_sans_voyelles"?
        # Yes, usually "hebreu_sans_voyelles" is the FULL text.
        # But for mots_alignes, we only map the non-bracketed text.
        
        # Actually, wait. Let's see if the existing "hebreu_sans_voyelles" has the brackets.
        # For seif 1, it didn't have brackets in mots_alignes, but did it have it in hebreu_sans_voyelles?
        
        no_brackets = clean_brackets(raw_text)
        words = no_brackets.split()
        
        mots_count = 0
        target_h = None
        for h in data['halakhot']:
            if int(h.get('seif', 0)) == seif:
                target_h = h
                mots_count = len(h.get('mots_alignes', []))
                break
                
        if not target_h:
            print(f"Seif {seif} not found in json.")
            continue
            
        print(f"Seif {seif}: words={len(words)}, mots={mots_count}")
        if len(words) != mots_count:
            # Let's print the mismatch
            print(f"  Mismatch in Seif {seif}!")
            # show difference
            mots_words = [m.get('hebreu_brut', '') for m in target_h.get('mots_alignes', [])]
            print(f"  User end: {' '.join(words[-5:])}")
            print(f"  Mots end: {' '.join(mots_words[-5:])}")

if __name__ == "__main__":
    main()
