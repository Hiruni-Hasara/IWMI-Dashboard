import geopandas as gpd
import pandas as pd
import os
import re

# Folder containing 12 monthly shapefiles
INPUT_DIR = r"C:/Users/H.Weliwitiya/OneDrive - CGIAR/Desktop/Botanga_raw_data/High_Resolution_WA_Bontanga/outputs_new/IP_indicators/Equity/monthly_equity_analysis"
OUTPUT_FILE = r"C:/Users/H.Weliwitiya/OneDrive - CGIAR/Desktop/Botanga_raw_data/High_Resolution_WA_Bontanga/outputs_new/equity_new.gpkg"


# Month mapping
MONTH_MAP = {
    "01": "Jan", "02": "Feb", "03": "Mar",
    "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep",
    "10": "Oct", "11": "Nov", "12": "Dec"
}

gdf_list = []

for file in os.listdir(INPUT_DIR):
    if file.endswith(".shp"):
        filepath = os.path.join(INPUT_DIR, file)

        # --- Extract season, month, year from filename ---
        # Example: equity_monthly_dry_01_2014.shp
        match = re.search(r"equity_monthly_(dry|wet|transition)_(\d{2})_(\d{4})\.shp$", file, re.IGNORECASE)
        if match:
            season = match.group(1).capitalize()  # Dry / Wet / Transition
            month_num = match.group(2)
            year = int(match.group(3))
            month_name = MONTH_MAP[month_num]
        else:
            raise ValueError(f"Filename does not match expected pattern: {file}")

        # Read shapefile
        gdf = gpd.read_file(filepath)

        gdf["Year"] = year
        gdf["Month"] = int(month_num)
        gdf["Month_name"] = month_name
        gdf["Season"] = season

        # --- Extract Bank and Lateral from Block_name ---
        def parse_block(block_name):
            # Format: LBC-L3A-L or RBC-L5B-R
            parts = str(block_name).split("-")
            if len(parts) == 3:
                bank_code, lateral, side = parts
                bank = "Left" if bank_code.upper() == "LBC" else "Right"
                return lateral, bank
            else:
                return None, None

        gdf[["Lateral", "Bank"]] = gdf["Block_name"].apply(lambda x: pd.Series(parse_block(x)))

        # --- Extract WUA part ---
        gdf["WUA"] = gdf["WUA"].apply(lambda x: str(x).split("-")[-1])

        # --- Standardize other fields ---
        gdf["Parameter"] = "Equity"
        gdf["Value"] = gdf["cv_unif"]
        gdf["Classification"] = gdf["unif_cls"]

        # --- Keep only master fields ---
        gdf_final = gdf[
            [
                "WUA",
                "Lateral",
                "Bank",
                "Year",
                "Parameter",
                "Season",
                "Month_name",
                "Month",
                "Value",
                "Classification",
                "geometry",
            ]
        ]

        gdf_list.append(gdf_final)

# --- Combine all shapefiles ---
master_gdf = gpd.GeoDataFrame(
    pd.concat(gdf_list, ignore_index=True),
    crs=gdf_list[0].crs
)

# --- Sort by Year -> Month_Num -> WUA ---
master_gdf = master_gdf.sort_values(
    by=["Year", "Month", "WUA"],
    ignore_index=True
)

# --- Save to GeoPackage ---
master_gdf.to_file(
    OUTPUT_FILE,
    layer="equity_monthly_master",
    driver="GPKG"
)

print("✅ Monthly Equity shapefiles successfully merged!")
print(f"📁 Output: {OUTPUT_FILE}")
print(f"📊 Total records: {len(master_gdf)}")
