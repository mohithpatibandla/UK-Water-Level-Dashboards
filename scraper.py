# import requests
# from bs4 import BeautifulSoup
# import json
# import os
# from datetime import datetime

# # UK Dams and their coordinates (sample)
# dam_coordinates = {
#     "Rutland Water": {"latitude": 52.642, "longitude": -0.626},
#     "Kielder Water": {"latitude": 55.208, "longitude": -2.583},
#     "Haweswater": {"latitude": 54.516, "longitude": -2.826},
#     "Thirlmere": {"latitude": 54.509, "longitude": -3.058},
#     "Lake Vyrnwy": {"latitude": 52.759, "longitude": -3.476}
# }

# # Simulated UK water report page (replace this with a real URL)
# url = "https://environment.data.gov.uk/hydrology/explore"

# # Extract dam data
# def fetch_dam_data():
#     # Simulate HTTP request (replace with actual scraping logic)
#     response = requests.get(url)  # You may need headers
#     soup = BeautifulSoup(response.text, 'html.parser')

#     # Dummy logic since we don't have real structure
#     dam_data = []

#     for name, coords in dam_coordinates.items():
#         dam = {
#             "name": name,
#             "latitude": coords["latitude"],
#             "longitude": coords["longitude"],
#             "date": datetime.now().strftime("%Y-%m-%d"),
#             "waterLevel": f"{round(100 * (0.6 + 0.4 * hash(name) % 100 / 100.0), 2)} m",
#             "storagePercentage": f"{round(50 + hash(name) % 50)}%",
#             "rainfall": f"{round(hash(name) % 10)} mm"
#         }
#         dam_data.append(dam)

#     return dam_data

# # Save JSON
# def save_data(data, folder='uk_dam_data'):
#     os.makedirs(folder, exist_ok=True)
#     live_path = os.path.join(folder, "live.json")

#     with open(live_path, 'w') as f:
#         json.dump({
#             "lastUpdate": datetime.now().strftime("%Y-%m-%d"),
#             "dams": data
#         }, f, indent=4)

#     print(f"Saved data to {live_path}")

# # Run
# if __name__ == "__main__":
#     dams = fetch_dam_data()
#     save_data(dams)




import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

# Wikipedia source URL
wiki_url = "https://en.wikipedia.org/wiki/List_of_reservoirs_in_the_United_Kingdom"

def get_uk_dam_coordinates():
    response = requests.get(wiki_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    tables = soup.find_all('table', class_='wikitable')

    dam_coordinates = {}

    for table in tables:
        rows = table.find_all('tr')[1:]  # Skip header row

        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 6:
                continue

            name = cols[1].get_text(strip=True)
            geo_span = row.find('span', class_='geo')
            if geo_span:
                latlon = geo_span.text.strip()  # Example: "51.828181;0.873431"
                lat_str, lon_str = latlon.split(';')
                latitude = float(lat_str)
                longitude = float(lon_str)
                dam_coordinates[name] = {
                    "latitude": latitude,
                    "longitude": longitude
                }

    return dam_coordinates

# Generate dummy water data for dams
def fetch_dam_data():
    dam_coordinates = get_uk_dam_coordinates()
    print(f" Total reservoirs extracted: {len(dam_coordinates)}")

    dam_data = []

    for name, coords in dam_coordinates.items():
        dam = {
            "name": name,
            "latitude": coords["latitude"],
            "longitude": coords["longitude"],
            "date": datetime.now().strftime("%Y-%m-%d"),
            "waterLevel": f"{round(100 * (0.6 + 0.4 * hash(name) % 100 / 100.0), 2)} m",
            "storagePercentage": f"{round(50 + hash(name) % 50)}%",
            "rainfall": f"{round(hash(name) % 10)} mm"
        }
        dam_data.append(dam)

    return dam_data

# Save as live.json
def save_data(data, folder='uk_dam_data'):
    os.makedirs(folder, exist_ok=True)
    live_path = os.path.join(folder, "live.json")

    with open(live_path, 'w') as f:
        json.dump({
            "lastUpdate": datetime.now().strftime("%Y-%m-%d"),
            "dams": data
        }, f, indent=4)

    print(f" Saved data to {live_path}")

# Run
if __name__ == "__main__":
    dams = fetch_dam_data()
    save_data(dams)
