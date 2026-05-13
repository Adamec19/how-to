import json
from collections import defaultdict

def count_components(json_file_path, output_file_path):
    # Načtení JSON souboru
    with open(json_file_path, 'r') as file:
        data = json.load(file).get("data", [])
    
    # Inicializace slovníků pro celkové a specifické počty
    total_counts = defaultdict(int)
    public_web_counts = defaultdict(lambda: defaultdict(int))
    total_component_count = 0  # Počet všech komponent

    # Rekurzivní funkce pro nalezení všech komponent
    def find_components(obj, public_web_value):
        nonlocal total_component_count
        if isinstance(obj, dict):
            # Pokud je objekt komponenta, počítáme ji
            if "__component" in obj:
                component_name = obj["__component"]
                total_counts[component_name] += 1
                public_web_counts[component_name][public_web_value] += 1
                total_component_count += 1  # Zvýšení celkového počtu
            # Rekurzivně procházíme vnořené objekty
            for key, value in obj.items():
                if key == "publicWeb":
                    public_web_value = value.lower()
                find_components(value, public_web_value)
        elif isinstance(obj, list):
            for item in obj:
                find_components(item, public_web_value)

    # Procházení každé stránky v poli data
    for page in data:
        public_web_value = page.get("publicWeb", "UNKNOWN").lower()
        find_components(page, public_web_value)

    # Vytvoření struktury pro ukládání výsledků
    statistics = {
        "total_component_types": len(total_counts),  # Celkový počet typů komponent
        "total_components_processed": total_component_count,  # Celkový počet všech komponent
        "components": []
    }
    
    # Přidání detailů o jednotlivých komponentách
    for component, total_count in total_counts.items():
        public_web_detail = public_web_counts[component]
        component_stats = {
            "name": component,
            "total_count": total_count,
            "public_web_breakdown": public_web_detail
        }
        statistics["components"].append(component_stats)
    
    # Uložení výsledků do souboru JSON
    with open(output_file_path, 'w') as outfile:
        json.dump(statistics, outfile, indent=4)
    
    # Výpis potvrzení
    print(f"Statistiky byly uloženy do souboru: {output_file_path}")

# Zavolání funkce s cestou k vašemu JSON souboru
count_components('strapi_pages.json', 'component_statistics.json')