import json
with open('public/data/siman_1.json', encoding='utf-8') as f:
    data = json.load(f)
for i, h in enumerate(data['halakhot']):
    if h['seif'] in ['38', '39', '40', '41', '42', '43', '44']:
        print(f"Index: {i}, Seif: {h['seif']}")
