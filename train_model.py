import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import json

# --------------------
# LOAD DATA
# --------------------

df = pd.read_csv("data/accidents.csv")

# --------------------
# CLEAN DATA
# --------------------

numeric_cols = [
    "latitude",
    "longitude",
    "Number of Casualties",
    "Number of Fatalities"
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

# --------------------
# TARGET (RISK SCORE)
# --------------------
# Base spatial risk from accident impact

y = (
    df["Number of Fatalities"] * 20 +
    df["Number of Casualties"] * 10
).fillna(0)

# --------------------
# FEATURES (ONLY LOCATION)
# --------------------

X = df[["latitude", "longitude"]]

# --------------------
# TRAIN MODEL
# --------------------

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=12,
    n_jobs=-1,
    random_state=42
)

model.fit(X, y)

# --------------------
# CREATE GRID (VECTORISED)
# --------------------

lats = np.arange(6, 37, 0.5)
lons = np.arange(68, 97, 0.5)

grid_points = [
    {"latitude": lat, "longitude": lon}
    for lat in lats
    for lon in lons
]

grid_df = pd.DataFrame(grid_points)

# --------------------
# PREDICT GRID RISK
# --------------------

predictions = model.predict(grid_df)
predictions = np.clip(predictions, 0, 100)

# --------------------
# BUILD RISK GRID JSON
# --------------------

risk_grid = {}

for i, row in grid_df.iterrows():
    key = f"{round(row.latitude,2)}_{round(row.longitude,2)}"
    risk_grid[key] = round(float(predictions[i]), 1)

with open("risk_grid.json", "w") as f:
    json.dump(risk_grid, f)

print("risk_grid.json generated successfully")
