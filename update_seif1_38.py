import json
import difflib

def hebrew_letter_to_number(letters):
    values = {'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10,
              'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90, 'ק': 100,
              'ר': 200, 'ש': 300, 'ת': 400}
    cleaned = ''.join(c for c in letters if c in values)
    return sum(values.get(char, 0) for char in cleaned)

def clean_word_for_matching(word):
    # Remove punctuation for better matching
    import re
    return re.sub(r'[^\w\s]', '', word)

def align_and_update(seif, user_words, mots_alignes):
    # We want to match mots_alignes words to user_words
    mots_text = [m.get('hebreu_brut', '') for m in mots_alignes]
    
    # We will use difflib to find the best alignment based on word similarity
    matcher = difflib.SequenceMatcher(None, mots_text, user_words)
    
    updated_mots = 0
    
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'equal' or tag == 'replace':
            # For each word in this block, update mots_alignes
            for i, j in zip(range(i1, i2), range(j1, j2)):
                old_word = mots_alignes[i].get('hebreu_brut', '')
                new_word = user_words[j]
                mots_alignes[i]['hebreu_brut'] = new_word
                updated_mots += 1
        elif tag == 'delete':
            # Words in mots_alignes that have no corresponding word in user_words.
            pass
        elif tag == 'insert':
            # Words in user_words that have no corresponding word in mots_alignes (e.g. brackets)
            pass
            
    return updated_mots

def main():
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
        user_words = line.split()
        
        for h in data['halakhot']:
            if int(h.get('seif', 0)) == seif:
                mots = h.get('mots_alignes', [])
                if not mots:
                    continue
                
                updated = align_and_update(seif, user_words, mots)
                # also update hebreu_sans_voyelles
                h.setdefault('texte_integral', {})['hebreu_sans_voyelles'] = line
                
                print(f"Seif {seif}: Updated {updated} out of {len(mots)} mots.")
                break

    with open('public/data/siman_1.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()
