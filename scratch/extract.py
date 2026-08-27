import json

with open(r"c:\Users\natha\OneDrive\Bureau\My Apps\Halakh'App\public\data\הלכות הנהגת אדם בבוקר\siman_1.json", 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(r"c:\Users\natha\OneDrive\Bureau\My Apps\Halakh'App\scratch\siman_1_fr.txt", 'w', encoding='utf-8') as f:
    for h in data['halakhot']:
        f.write(f"Seif {h['seif']}:\n{h['texte_integral']['francais']}\n\n")
