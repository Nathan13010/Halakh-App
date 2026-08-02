import json
data = json.load(open('public/data/siman_1.json', encoding='utf-8'))
res = []
for h in data['halakhot']:
    if h['seif'] in ['38', '39', '40', '41', '42', '43', '44']:
        res.append(f"Seif: {h['seif']}, Sujet: {h.get('sujet', 'NONE')}")
with open('test_sujet.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(res))
